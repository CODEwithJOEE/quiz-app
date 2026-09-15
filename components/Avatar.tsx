import { cn } from "@/lib/cn";

// We'll pass a pre-signed URL from the server component
export default function Avatar({
  url,
  initials,
  size = "md",
  pending = false,
}: {
  url?: string | null;
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  pending?: boolean;
}) {
  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-20 h-20 text-2xl",
  }[size];

  if (url && !pending) {
    return (
      <div className={cn("rounded-full overflow-hidden shrink-0", sizeClasses)}>
        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shrink-0 relative",
        "bg-brand text-brand-foreground",
        sizeClasses,
      )}
    >
      {initials}
      {pending && (
        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border border-card">
          ⏳
        </span>
      )}
    </div>
  );
}
