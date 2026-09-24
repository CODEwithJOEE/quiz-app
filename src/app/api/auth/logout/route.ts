// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie") ?? "";
          const cookies = cookieHeader.split(";").map((c) => {
            const [name, ...rest] = c.trim().split("=");
            return { name, value: rest.join("=") };
          });
          return cookies;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  await supabase.auth.signOut();

  // ✅ FORCE-CLEAR any remaining sb-* cookies
  const cookieHeader = request.headers.get("cookie") ?? "";
  cookieHeader.split(";").forEach((c) => {
    const name = c.trim().split("=")[0];
    if (name.startsWith("sb-")) {
      response.cookies.set(name, "", {
        maxAge: 0,
        path: "/",
        expires: new Date(0),
      });
    }
  });

  return response;
}
