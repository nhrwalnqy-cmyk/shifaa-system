import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { Building2, CalendarClock, ClipboardList, LayoutDashboard, Stethoscope, Users } from "lucide-react";

const navItems: NavItem[] = [
  { href: "/hospital/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/hospital/departments", label: "الأقسام", icon: Building2 },
  { href: "/hospital/doctors", label: "الأطباء", icon: Stethoscope },
  { href: "/hospital/schedules", label: "الجداول", icon: CalendarClock },
  { href: "/hospital/appointments", label: "المواعيد", icon: ClipboardList },
  { href: "/hospital/queue", label: "الطابور المباشر", icon: Users },
];

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  // SUPABASE: fetch current admin profile + hospital name for the sidebar
  return (
    <DashboardShell navItems={navItems} userName="إدارة المستشفى" roleLabel="مسؤول المنشأة" hospitalName="مستشفى النور التخصصي">
      {children}
    </DashboardShell>
  );
}
