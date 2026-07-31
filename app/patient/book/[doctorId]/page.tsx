"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { mockDoctors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const timeSlots = ["09:00", "09:15", "09:30", "10:00", "10:15", "16:30", "16:45", "17:00", "17:30"];

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function BookAppointmentPage({ params }: { params: { doctorId: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const doctor = mockDoctors.find((d) => d.id === params.doctorId);
  const days = useMemo(() => nextDays(7), []);

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!doctor) return notFound();

  async function handleConfirm() {
    if (!selectedTime) return;
    setLoading(true);

    // SUPABASE:
    // const { data: userData } = await supabase.auth.getUser();
    // const { data, error } = await supabase.from('appointments').insert({
    //   patient_id: userData.user!.id,
    //   hospital_id: doctor.hospital_id,
    //   department_id: doctor.department_id,
    //   doctor_id: doctor.id,
    //   appointment_date: days[selectedDay].toISOString().slice(0, 10),
    //   scheduled_time: selectedTime,
    //   reason,
    // }).select().single();

    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    router.push("/patient/appointments?booked=1");
  }

  return (
    <div className="pb-32">
      <header className="border-b border-line bg-white">
        <div className="container-app flex items-center gap-3 py-4">
          <Link href={`/patient/doctors/${doctor.id}`} className="text-teal-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-teal-950">حجز موعد</h1>
            <p className="text-xs text-slate-500">{doctor.full_name}</p>
          </div>
        </div>
      </header>

      <div className="container-app space-y-6 py-6">
        <section>
          <h2 className="mb-3 font-display font-bold text-teal-950">اختر اليوم</h2>
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={cn(
                  "flex w-16 shrink-0 flex-col items-center rounded-xl border py-3 text-sm transition",
                  selectedDay === i ? "border-teal-900 bg-teal-900 text-white" : "border-line bg-white text-teal-950"
                )}
              >
                <span className="text-xs opacity-80">
                  {new Intl.DateTimeFormat("ar-SA", { weekday: "short" }).format(d)}
                </span>
                <span className="nums mt-1 font-display text-lg font-bold">
                  {new Intl.DateTimeFormat("ar-SA", { day: "numeric" }).format(d)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display font-bold text-teal-950">اختر الوقت</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={cn(
                  "nums rounded-xl border py-2.5 text-sm font-bold transition",
                  selectedTime === t ? "border-amber-500 bg-amber-500 text-teal-950" : "border-line bg-white text-teal-900"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display font-bold text-teal-950">سبب الزيارة (اختياري)</h2>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="مثال: ألم في المعدة منذ يومين"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </section>

        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">رسوم الكشف</span>
            <span className="nums font-bold text-teal-950">{doctor.consultation_fee} ريال</span>
          </div>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-16 border-t border-line bg-white/95 p-4 backdrop-blur sm:bottom-0">
        <div className="container-app">
          <Button fullWidth size="lg" disabled={!selectedTime} loading={loading} onClick={handleConfirm}>
            <Check className="h-4 w-4" /> تأكيد الحجز
          </Button>
        </div>
      </div>
    </div>
  );
}
