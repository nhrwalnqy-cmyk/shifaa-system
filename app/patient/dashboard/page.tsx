import { PatientTopBar } from "@/components/layout/PatientTopBar";
import { QueueBoard } from "@/components/queue/QueueBoard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockAppointments, mockHospitals } from "@/lib/mock-data";
import { APPOINTMENT_STATUS_LABELS_AR } from "@/lib/types";
import { formatArabicDate, formatArabicTime } from "@/lib/utils";
import { CalendarPlus, ChevronLeft, MapPin, Search, Star } from "lucide-react";
import Link from "next/link";

// SUPABASE: fetch profile via supabase.from('profiles').select().eq('id', user.id).single()
const patientName = "عبدالرحمن السالم";

export default function PatientDashboardPage() {
  // SUPABASE: appointments today with status checked_in/in_progress -> join queue_tickets
  const activeAppointment = mockAppointments.find((a) => a.status === "checked_in");
  const upcoming = mockAppointments.filter((a) => a.status === "booked").slice(0, 2);

  return (
    <div>
      <PatientTopBar patientName={patientName} greeting="مساء الخير 👋" />

      <div className="container-app space-y-6 py-6">
        {activeAppointment && (
          <section>
            <h2 className="mb-3 font-display text-lg font-bold text-teal-950">دورك الحالي</h2>
            <QueueBoard
              nowServing={42}
              yourNumber={43}
              waitMinutes={0}
              doctorName={`${activeAppointment.doctor_name} — ${activeAppointment.department_name}`}
            />
            <Link href={`/patient/queue/${activeAppointment.id}`}>
              <Button fullWidth variant="outline" className="mt-3">
                عرض تفاصيل الطابور
              </Button>
            </Link>
          </section>
        )}

        {/* Quick actions */}
        <section className="grid grid-cols-2 gap-3">
          <Link href="/patient/search">
            <Card className="flex flex-col items-center gap-2 p-5 text-center hover:border-teal-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                <Search className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold text-teal-950">ابحث عن طبيب</p>
            </Card>
          </Link>
          <Link href="/patient/search?tab=hospitals">
            <Card className="flex flex-col items-center gap-2 p-5 text-center hover:border-teal-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <CalendarPlus className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold text-teal-950">حجز موعد جديد</p>
            </Card>
          </Link>
        </section>

        {/* Upcoming appointments */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-teal-950">مواعيدك القادمة</h2>
            <Link href="/patient/appointments" className="text-sm font-semibold text-teal-700">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <Card className="p-6 text-center text-sm text-slate-500">لا توجد مواعيد قادمة حاليًا</Card>
            )}
            {upcoming.map((appt) => (
              <Card key={appt.id} className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-teal-950 text-white">
                  <span className="text-[10px] leading-none text-teal-300">
                    {formatArabicDate(appt.appointment_date).split(" ")[0]}
                  </span>
                  <span className="nums font-mono text-sm font-bold">
                    {formatArabicTime(appt.scheduled_time)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold text-teal-950">{appt.doctor_name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {appt.hospital_name} · {appt.department_name}
                  </p>
                </div>
                <Badge tone="teal">{APPOINTMENT_STATUS_LABELS_AR[appt.status]}</Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Nearby hospitals */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-teal-950">مستشفيات قريبة منك</h2>
            <Link href="/patient/search?tab=hospitals" className="text-sm font-semibold text-teal-700">
              عرض الكل
            </Link>
          </div>
          <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {mockHospitals.map((h) => (
              <Link href={`/patient/search?hospital=${h.slug}`} key={h.id} className="shrink-0">
                <Card className="w-64 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {h.rating}
                    </span>
                  </div>
                  <p className="mt-3 truncate font-display font-bold text-teal-950">{h.name}</p>
                  <p className="text-xs text-slate-500">
                    {h.city} — {h.district}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-teal-700">
                    <span>{h.doctors_count} طبيب</span>
                    <ChevronLeft className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
