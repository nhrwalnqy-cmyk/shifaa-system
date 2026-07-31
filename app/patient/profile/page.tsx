import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Bell, ChevronLeft, FileText, HelpCircle, LogOut, Shield, User } from "lucide-react";
import Link from "next/link";

const menu = [
  { icon: User, label: "البيانات الشخصية", href: "#" },
  { icon: FileText, label: "السجل الطبي", href: "#" },
  { icon: Bell, label: "إعدادات التنبيهات", href: "/patient/notifications" },
  { icon: Shield, label: "الخصوصية والأمان", href: "#" },
  { icon: HelpCircle, label: "المساعدة والدعم", href: "#" },
];

export default function PatientProfilePage() {
  // SUPABASE: supabase.from('profiles').select().eq('id', user.id).single()
  const patientName = "عبدالرحمن السالم";
  const phone = "+966 5xx xxx xxx";

  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="container-app flex items-center gap-4 py-6">
          <Avatar name={patientName} size={56} />
          <div>
            <h1 className="font-display text-lg font-bold text-teal-950">{patientName}</h1>
            <p dir="ltr" className="text-left text-sm text-slate-500">
              {phone}
            </p>
          </div>
        </div>
      </header>

      <div className="container-app space-y-3 py-5">
        <Card className="divide-y divide-line overflow-hidden">
          {menu.map(({ icon: Icon, label, href }) => (
            <Link key={label} href={href} className="flex items-center gap-3 p-4 hover:bg-teal-50/60">
              <Icon className="h-5 w-5 text-teal-700" />
              <span className="flex-1 text-sm font-semibold text-teal-950">{label}</span>
              <ChevronLeft className="h-4 w-4 text-slate-300" />
            </Link>
          ))}
        </Card>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white p-4 text-sm font-bold text-danger"
        >
          <LogOut className="h-4 w-4" /> تسجيل الخروج
        </Link>
      </div>
    </div>
  );
}
