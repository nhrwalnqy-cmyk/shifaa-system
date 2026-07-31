import { Card } from "@/components/ui/Card";
import { ArrowRight, Bell, CalendarCheck2, TimerReset } from "lucide-react";
import Link from "next/link";

// SUPABASE: supabase.from('notifications').select().eq('profile_id', user.id).order('created_at', { ascending: false })
const notifications = [
  { id: "n1", icon: TimerReset, title: "اقترب دورك", body: "تبقى مريضان أمامك عند د. سارة الحربي", time: "منذ ٢ دقيقة", unread: true },
  { id: "n2", icon: CalendarCheck2, title: "تم تأكيد حجزك", body: "موعدك مع د. منى القحطاني يوم الأحد ٦:٠٠ م", time: "أمس", unread: false },
  { id: "n3", icon: Bell, title: "تذكير بالموعد", body: "موعدك غدًا الساعة ٩:٠٠ ص في مستشفى النور", time: "قبل يومين", unread: false },
];

export default function PatientNotificationsPage() {
  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="container-app flex items-center gap-3 py-4">
          <Link href="/patient/dashboard" className="text-teal-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-teal-950">التنبيهات</h1>
        </div>
      </header>

      <div className="container-app space-y-2 py-5">
        {notifications.map(({ id, icon: Icon, title, body, time, unread }) => (
          <Card key={id} className={`flex items-start gap-3 p-4 ${unread ? "border-amber-300 bg-amber-50/40" : ""}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-teal-950">{title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{body}</p>
              <p className="mt-1 text-xs text-slate-400">{time}</p>
            </div>
            {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />}
          </Card>
        ))}
      </div>
    </div>
  );
}
