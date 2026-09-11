"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "./ui/Button";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (!confirm("Log out?")) return;
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="danger"
      size="lg"
      className="w-full"
      loading={loading}
      onClick={handleLogout}
    >
      {!loading && <LogOut className="w-4 h-4" />}
      {loading ? "Logging out..." : "Log Out"}
    </Button>
  );
}
