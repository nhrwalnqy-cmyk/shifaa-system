"use client";

import { cn } from "@/lib/utils";
import { CalendarClock, Home, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/patient/dashboard", label: "الرئيسية", icon: Home },
  { href: "/patient/search", label: "بحث", icon: Search },
  { href: "/patient/appointments", label: "مواعيدي", icon: CalendarClock },
  { href: "/patient/profile", label: "حسابي", icon: User },
];

export function PatientBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur sm:hidden">
      <div className="flex items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs"
            >
              <Icon
                className={cn("h-5 w-5", active ? "text-teal-900" : "text-slate-400")}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={cn("font-semibold", active ? "text-teal-900" : "text-slate-400")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
