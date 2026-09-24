import { useTranslations } from "next-intl";
import { FileEdit, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "./ui/Badge";

export default function QuizStatusBadge({ status }: { status: string }) {
  const t = useTranslations("QuizStatus");

  if (status === "published") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="w-3 h-3" />
        {t("published")}
      </Badge>
    );
  }

  if (status === "closed") {
    return (
      <Badge variant="default">
        <Lock className="w-3 h-3" />
        {t("closed")}
      </Badge>
    );
  }

  return (
    <Badge variant="warning">
      <FileEdit className="w-3 h-3" />
      {t("draft")}
    </Badge>
  );
}
