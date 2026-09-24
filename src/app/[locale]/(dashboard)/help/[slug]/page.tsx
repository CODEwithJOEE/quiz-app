export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { getArticle, type HelpSection } from "../content";
import { Card } from "@/components/ui/Card";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Help");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }

  const article = getArticle(slug);
  if (!article) notFound();

  if (!article.roles.includes(me.role)) {
    return (
      <div className="space-y-4">
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToHelp")}
        </Link>
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">{t("notAccessible")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        href="/help"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToHelp")}
      </Link>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold">{article.title}</h1>
        <p className="text-sm text-muted-foreground">{article.description}</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {article.sections.map((section, i) => (
          <SectionCard key={i} section={section} />
        ))}
      </div>

      {/* Footer */}
      <Card className="p-4 bg-muted/50">
        <p className="text-xs text-muted-foreground text-center">
          {t("helpfulFooter")}
        </p>
      </Card>
    </div>
  );
}

function SectionCard({ section }: { section: HelpSection }) {
  const lines = section.body.split("\n");

  return (
    <Card className="p-4 space-y-3">
      <h2 className="font-semibold text-base">{section.heading}</h2>
      <div className="text-sm space-y-2">
        {lines.map((line, i) => (
          <ParsedLine key={i} line={line} />
        ))}
      </div>
    </Card>
  );
}

function ParsedLine({ line }: { line: string }) {
  if (line.trim() === "") return <div className="h-1" />;
  if (line.trim() === "```") return null;

  if (line.trim().startsWith("|")) {
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (cells.every((c) => /^:?-+:?$/.test(c))) return null;

    return (
      <div className="flex gap-2 text-xs py-1 border-b border-border/50 last:border-b-0">
        {cells.map((cell, i) => (
          <span
            key={i}
            className={`flex-1 min-w-0 ${
              i === 0 ? "font-medium" : "text-muted-foreground"
            }`}
          >
            <InlineMarkdown text={cell} />
          </span>
        ))}
      </div>
    );
  }

  if (line.trim().startsWith("```") || line.includes("\\`\\`\\`")) {
    return (
      <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
        {line}
      </pre>
    );
  }

  if (line.trim().startsWith("- ") || line.trim().match(/^\d+\.\s/)) {
    return (
      <p className="pl-3 text-sm">
        <InlineMarkdown text={line} />
      </p>
    );
  }

  return (
    <p className="text-sm leading-relaxed">
      <InlineMarkdown text={line} />
    </p>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="text-[0.85em] px-1.5 py-0.5 rounded bg-muted font-mono"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("*")) {
      parts.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
