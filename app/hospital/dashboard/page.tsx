import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { mockAppointments, mockDoctors, mockQueueToday } from "@/lib/mock-data";
import { APPOINTMENT_STATUS_LABELS_AR } from "@/lib/types";
import { formatArabicTime } from "@/lib/utils";
import { CalendarCheck2, Clock3, Stethoscope, Users } from "lucide-react";
import { useMemo } from "react";

function HospitalDashboardPageInner() {
  // SUPABASE: aggregate queries against appointments/queue_tickets for today
  const stats = useMemo(() => {
    const waitingCount = mockQueueToday.filter((q) => q.status === "waiting").length;
    const doneToday = mockQueueToday.filter((q) => q.status === "done").length;
    return { waitingCount, doneToday };
  }, []);

  const departmentStats = useMemo(
    () => [
      { name: "الباطنية", pct: 82 },
      { name: "الأطفال", pct: 61 },
      { name: "الجلدية", pct: 40 },
    ],
    []
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-extrabold text-teal-950">نظرة عامة</h1>
        <p className="text-xs md:text-sm text-slate-600 mt-1">ملخص أداء المستشفى لليوم الحالي</p>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="مواعيد اليوم" value={24} icon={CalendarCheck2} tone="teal" trend="+12% عن أمس" />
        <StatCard label="بالانتظار الآن" value={stats.waitingCount} icon={Users} tone="amber" />
        <StatCard label="تم الكشف عليهم" value={stats.doneToday} icon={Clock3} tone="success" />
        <StatCard label="الأطباء المتاحون" value={mockDoctors.length} icon={Stethoscope} tone="teal" />
      </div>

      <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>مواعيد اليوم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockAppointments.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-4">لا توجد مواعيد لليوم</p>
            ) : (
              mockAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-teal-950 text-sm truncate">{appt.doctor_name}</p>
                    <p className="text-xs text-slate-600">{appt.department_name}</p>
                  </div>
                  <div className="flex items-center gap-2 xs:gap-3">
                    <p className="nums text-sm text-slate-600 shrink-0">{formatArabicTime(appt.scheduled_time)}</p>
                    <Badge tone="teal" className="shrink-0">{APPOINTMENT_STATUS_LABELS_AR[appt.status]}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الأقسام الأكثر ازدحامًا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentStats.map((d) => (
              <div key={d.name}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-semibold text-teal-950">{d.name}</span>
                  <span className="nums text-slate-600 font-medium">{d.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-teal-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-700 transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                    role="progressbar"
                    aria-valuenow={d.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function HospitalDashboardPage() {
  return (
    <ErrorBoundary>
      <HospitalDashboardPageInner />
    </ErrorBoundary>
  );
}
