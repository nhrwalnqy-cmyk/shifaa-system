"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { LogOut, LucideIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  navItems,
  userName,
  roleLabel,
  hospitalName,
  children,
}: {
  navItems: NavItem[];
  userName: string;
  roleLabel: string;
  hospitalName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change or when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  const Sidebar = (
    <div className="flex h-full flex-col bg-teal-950 text-white overflow-y-auto">
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex-1 min-w-0">
          <Logo dark />
        </div>
        <button
          className="sm:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setOpen(false)}
          aria-label="إغلاق القائمة"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {hospitalName && (
        <div className="mx-4 mb-6 rounded-xl bg-white/5 px-3 py-2.5 border border-white/10">
          <p className="text-xs text-teal-200 font-medium">{roleLabel}</p>
          <p className="truncate font-display text-sm font-bold text-white">{hospitalName}</p>
        </div>
      )}

      <nav className="flex-1 space-y-1.5 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950",
                active
                  ? "bg-amber-500 text-teal-950 shadow-md"
                  : "text-teal-100 hover:bg-white/10 active:bg-white/20"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name={userName} size={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">{userName}</p>
            <p className="text-xs text-teal-200 truncate">{roleLabel}</p>
          </div>
        </div>
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-teal-100",
            "hover:bg-white/10 active:bg-white/20 transition-colors duration-150",
            "focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          تسجيل الخروج
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper sm:flex sm:flex-row-reverse">
      {/* Desktop sidebar (visually on the right in RTL) */}
      <aside className="hidden w-64 md:w-72 shrink-0 sm:block">
        <div className="sticky top-0 h-screen overflow-hidden">{Sidebar}</div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between border-b border-line bg-white p-3 sm:p-4">
          <Logo />
          <button
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-teal-900" />
          </button>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 sm:w-72 overflow-hidden">{Sidebar}</div>
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              role="presentation"
            />
          </div>
        )}
      </div>

      <main className="min-w-0 flex-1 p-3 xs:p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
