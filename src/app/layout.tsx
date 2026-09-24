// src/app/layout.tsx
import "./globals.css";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";
  const locale =
    routing.locales.find((l) => pathname.startsWith(`/${l}`)) ||
    routing.defaultLocale;

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
