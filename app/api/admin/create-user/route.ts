import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(1, "Full name is required"),
  role: z.enum(["teacher", "student"]),
  grade_level: z.string().nullable().optional(),
  section: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  // 1. Who's calling?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!me || !["super_admin", "teacher"].includes(me.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Validate body
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email, password, full_name, role, grade_level, section } =
    parsed.data;

  // 3. Teachers can only create students
  if (me.role === "teacher" && role !== "student") {
    return NextResponse.json(
      { error: "Teachers can only create students" },
      { status: 403 },
    );
  }

  // 4. Create the auth user (service role)
  const admin = createAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      role,
      grade_level: grade_level || null,
      section: section || null,
      created_by: user.id,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: created.user });
}
