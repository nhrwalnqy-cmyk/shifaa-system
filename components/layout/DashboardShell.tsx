"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { LogOut, LucideIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

  const Sidebar = (
    <div className="flex h-full flex-col bg-teal-950 text-white">
      <div className="flex items-center justify-between p-5">
        <Logo dark />
        <button className="sm:hidden" onClick={() => setOpen(false)} aria-label="إغلاق القائمة">
          <X className="h-5 w-5" />
        </button>
      </div>

      {hospitalName && (
        <div className="mx-5 mb-4 rounded-lg bg-white/5 px-3 py-2">
          <p className="text-xs text-teal-300">{roleLabel}</p>
          <p className="truncate font-display text-sm font-bold">{hospitalName}</p>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-amber-500 text-teal-950" : "text-teal-100 hover:bg-white/10"
              )}
            >
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <Avatar name={userName} size={36} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{userName}</p>
            <p className="text-xs text-teal-300">{roleLabel}</p>
          </div>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-teal-200 hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper sm:flex sm:flex-row-reverse">
      {/* Desktop sidebar (visually on the right in RTL) */}
      <aside className="hidden w-64 shrink-0 sm:block">
        <div className="sticky top-0 h-screen">{Sidebar}</div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between border-b border-line bg-white p-4">
          <Logo />
          <button onClick={() => setOpen(true)} aria-label="القائمة">
            <Menu className="h-6 w-6 text-teal-900" />
          </button>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-72">{Sidebar}</div>
            <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
          </div>
        )}
      </div>

      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
