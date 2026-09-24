// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import PWARegister from "@/components/PWARegister";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopLoader from "@/components/TopLoader";
import { Suspense } from "react";
import HtmlLang from "@/components/HtmlLang";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang />
      <Suspense fallback={null}>
        <TopLoader />
      </Suspense>
      <ThemeProvider>
        {children}
        <PWARegister />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
