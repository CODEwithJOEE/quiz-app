import { redirect } from "@/i18n/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { setRequestLocale } from "next-intl/server";

export default async function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const me = await getCurrentProfile();
  redirect({ href: me ? "/home" : "/login", locale });
}
