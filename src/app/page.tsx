// src/app/page.tsx (NEW)
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { routing } from "@/i18n/routing";

export default async function RootPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") ?? "";
  const prefersTagalog = acceptLang.toLowerCase().includes("tl");

  const locale =
    cookieLocale && routing.locales.includes(cookieLocale as any)
      ? cookieLocale
      : prefersTagalog && routing.locales.includes("tl")
        ? "tl"
        : routing.defaultLocale;

  redirect(`/${locale}`);
}
