import BottomNavServer from "@/components/BottomNavServer";
import InstallPrompt from "@/components/InstallPrompt";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-2xl mx-auto px-4 pt-4 animate-fade-in">
        {children}
      </main>
      <BottomNavServer />
      <InstallPrompt />
    </div>
  );
}
