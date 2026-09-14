"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth";

// Generate secure password
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 8; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

// Validate email format
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type BulkRow = {
  full_name: string;
  email: string;
  section?: string; // ← BAGO
};

export type BulkResult = {
  full_name: string;
  email: string;
  password: string;
  status: "created" | "failed";
  error?: string;
};

export async function bulkImportStudents(rows: BulkRow[]) {
  const me = await getCurrentProfile();
  if (!me || (me.role !== "teacher" && me.role !== "super_admin")) {
    return { error: "Forbidden" };
  }

  if (rows.length === 0) return { error: "No rows to import" };
  if (rows.length > 100) {
    return { error: "Maximum 100 students per batch" };
  }

  const supabase = await createClient();
  const admin = createAdminClient();
  const results: BulkResult[] = [];

  // Get existing emails to check duplicates
  const emails = rows.map((r) => r.email.trim().toLowerCase());
  const { data: existingProfiles } = await supabase
    .from("profiles")
    .select("email")
    .in("email", emails);

  const existingEmails = new Set(
    (existingProfiles ?? []).map((p: any) => p.email.toLowerCase()),
  );

  for (const row of rows) {
    const name = row.full_name.trim();
    const email = row.email.trim().toLowerCase();

    // Validate
    if (!name) {
      results.push({
        full_name: name,
        email,
        password: "",
        status: "failed",
        error: "Missing full name",
      });
      continue;
    }

    if (!isValidEmail(email)) {
      results.push({
        full_name: name,
        email,
        password: "",
        status: "failed",
        error: "Invalid email format",
      });
      continue;
    }

    // Check duplicate within DB
    if (existingEmails.has(email)) {
      results.push({
        full_name: name,
        email,
        password: "",
        status: "failed",
        error: "Email already exists",
      });
      continue;
    }

    // Generate password
    const password = generatePassword();

    // Create user via admin API
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        role: "student",
        section: row.section || null, // ← BAGO
        created_by: me.id,
      },
    });

    if (error) {
      results.push({
        full_name: name,
        email,
        password: "",
        status: "failed",
        error: error.message,
      });
      continue;
    }

    // Mark email as existing to prevent duplicate within same batch
    existingEmails.add(email);

    results.push({
      full_name: name,
      email,
      password,
      status: "created",
    });
  }

  revalidatePath("/students");
  revalidatePath("/admin/users");

  const created = results.filter((r) => r.status === "created").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return {
    ok: true,
    results,
    created,
    failed,
  };
}
