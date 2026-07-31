import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { LayoutDashboard } from "lucide-react";

const navItems: NavItem[] = [{ href: "/reception/dashboard", label: "لوحة الاستقبال", icon: LayoutDashboard }];

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  // SUPABASE: fetch current receptionist profile + hospital name for the sidebar
  return (
    <DashboardShell navItems={navItems} userName="نورة العمري" roleLabel="موظفة استقبال" hospitalName="مستشفى النور التخصصي">
      {children}
    </DashboardShell>
  );
}
