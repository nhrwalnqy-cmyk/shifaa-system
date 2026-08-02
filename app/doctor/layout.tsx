"use client";

import { DashboardShell, NavItem } from "@/components/layout/DashboardShell";
import { CalendarClock, LayoutDashboard, User, Users } from "lucide-react";

const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "قائمة اليوم", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "المرضى", icon: Users },
  { href: "/doctor/schedule", label: "أوقات الدوام", icon: CalendarClock },
  { href: "/doctor/profile", label: "الملف الشخصي", icon: User },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  // SUPABASE: fetch current doctor profile + hospital name for the sidebar
  return (
    <DashboardShell navItems={navItems} userName="د. سارة الحربي" roleLabel="طبيب" hospitalName="مستشفى النور التخصصي">
      {children}
    </DashboardShell>
  );
}
