import { Avatar } from "@/components/ui/Avatar";
import { Bell } from "lucide-react";
import Link from "next/link";

export function PatientTopBar({
  patientName,
  greeting,
}: {
  patientName: string;
  greeting?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-app flex items-center justify-between py-4">
        <div>
          <p className="text-xs text-slate-500">{greeting ?? "أهلاً بك"}</p>
          <p className="font-display text-lg font-bold text-teal-950">{patientName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/patient/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft"
          >
            <Bell className="h-5 w-5 text-teal-800" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500" />
          </Link>
          <Link href="/patient/profile">
            <Avatar name={patientName} size={40} />
          </Link>
        </div>
      </div>
    </header>
  );
}
