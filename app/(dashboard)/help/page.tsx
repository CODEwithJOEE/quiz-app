export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Rocket,
  GraduationCap,
  BookOpen,
  Shield,
  FileSpreadsheet,
  ArrowRight,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { getArticlesForRole } from "./content";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const ICONS: Record<string, LucideIcon> = {
  Rocket,
  GraduationCap,
  BookOpen,
  Shield,
  FileSpreadsheet,
};

export default async function HelpPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const articles = getArticlesForRole(me.role);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-brand text-brand-foreground flex items-center justify-center mx-auto shadow-lg shadow-brand/20">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold">Help & Documentation</h1>
        <p className="text-sm text-muted-foreground">
          Guides para sa {me.role.replace("_", " ")}
        </p>
      </div>

      {/* Articles list */}
      <ul className="space-y-3">
        {articles.map((article) => {
          const Icon = ICONS[article.icon] ?? BookOpen;
          return (
            <li key={article.slug}>
              <Link
                href={`/help/${article.slug}`}
                className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{article.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {article.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer note */}
      <Card className="p-4 bg-muted/50">
        <p className="text-xs text-muted-foreground text-center">
          May problema na hindi nasagot ng docs? Kontakin ang IT support ng
          school mo.
        </p>
      </Card>
    </div>
  );
}
