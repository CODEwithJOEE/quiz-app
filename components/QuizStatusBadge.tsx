import { FileEdit, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "./ui/Badge";

export default function QuizStatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="w-3 h-3" />
        Published
      </Badge>
    );
  }

  if (status === "closed") {
    return (
      <Badge variant="default">
        <Lock className="w-3 h-3" />
        Closed
      </Badge>
    );
  }

  return (
    <Badge variant="warning">
      <FileEdit className="w-3 h-3" />
      Draft
    </Badge>
  );
}
