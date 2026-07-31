import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockAppointments, mockDoctors, mockQueueToday } from "@/lib/mock-data";
import { APPOINTMENT_STATUS_LABELS_AR } from "@/lib/types";
import { formatArabicTime } from "@/lib/utils";
import { CalendarCheck2, Clock3, Stethoscope, Users } from "lucide-react";

export default function HospitalDashboardPage() {
  // SUPABASE: aggregate queries against appointments/queue_tickets for today
  const waitingCount = mockQueueToday.filter((q) => q.status === "waiting").length;
  const doneToday = mockQueueToday.filter((q) => q.status === "done").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-teal-950">نظرة عامة</h1>
        <p className="text-sm text-slate-500">ملخص أداء المستشفى لليوم الحالي</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="مواعيد اليوم" value={24} icon={CalendarCheck2} tone="teal" trend="+12% عن أمس" />
        <StatCard label="بالانتظار الآن" value={waitingCount} icon={Users} tone="amber" />
        <StatCard label="تم الكشف عليهم" value={doneToday} icon={Clock3} tone="success" />
        <StatCard label="الأطباء المتاحون" value={mockDoctors.length} icon={Stethoscope} tone="teal" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>مواعيد اليوم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between rounded-lg border border-line p-3">
                <div>
                  <p className="font-semibold text-teal-950">{appt.doctor_name}</p>
                  <p className="text-xs text-slate-500">{appt.department_name}</p>
                </div>
                <p className="nums text-sm text-slate-600">{formatArabicTime(appt.scheduled_time)}</p>
                <Badge tone="teal">{APPOINTMENT_STATUS_LABELS_AR[appt.status]}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأقسام الأكثر ازدحامًا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "الباطنية", pct: 82 },
              { name: "الأطفال", pct: 61 },
              { name: "الجلدية", pct: 40 },
            ].map((d) => (
              <div key={d.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold text-teal-950">{d.name}</span>
                  <span className="nums text-slate-500">{d.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-teal-100">
                  <div className="h-full rounded-full bg-teal-700" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
