import { getCurrentProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Palette } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function ProfilePage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const roleLabel: Record<string, string> = {
    super_admin: "Super Admin",
    teacher: "Teacher",
    student: "Student",
  };

  const roleVariant: Record<string, "info" | "success" | "danger"> = {
    super_admin: "danger",
    teacher: "info",
    student: "success",
  };

  const initials = me.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Profile</h1>

      {/* Profile card */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand/20">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-lg">{me.full_name}</p>
            <Badge variant={roleVariant[me.role]} className="mt-1">
              <Shield className="w-3 h-3" />
              {roleLabel[me.role]}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Details */}
      <Card>
        <div className="divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium truncate">{me.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium truncate">{me.email}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Theme toggle */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <Palette className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Appearance</p>
            <p className="text-xs text-muted-foreground">Pumili ng theme</p>
          </div>
        </div>
        <ThemeToggle />
      </Card>

      <LogoutButton />
    </div>
  );
}
