import { Avatar } from "@/components/ui/Avatar";
import { Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PatientTopBar({
  patientName,
  greeting,
}: {
  patientName: string;
  greeting?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container-app flex items-center justify-between py-3 md:py-4 px-3 md:px-0">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-slate-600">{greeting ?? "أهلاً بك"}</p>
          <p className="font-display text-base md:text-lg font-bold text-teal-950 truncate">
            {patientName}
          </p>
        </div>
        <div className="flex items-center gap-2.5 md:gap-3 ltr:ml-4 rtl:mr-4 flex-shrink-0">
          <Link
            href="/patient/notifications"
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full bg-white",
              "border border-slate-200 transition-all duration-200",
              "hover:bg-slate-50 hover:shadow-md",
              "focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
              "active:scale-95"
            )}
            aria-label="الإشعارات"
          >
            <Bell className="h-5 w-5 text-teal-800" />
            <span
              className="absolute ltr:right-1.5 rtl:left-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-danger animate-pulse"
              aria-label="يوجد إشعارات جديدة"
            />
          </Link>
          <Link
            href="/patient/profile"
            className="focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-full"
            aria-label="الملف الشخصي"
          >
            <Avatar name={patientName} size={40} />
          </Link>
        </div>
      </div>
    </header>
  );
}
