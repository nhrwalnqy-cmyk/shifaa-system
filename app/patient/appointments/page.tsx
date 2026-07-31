"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockAppointments } from "@/lib/mock-data";
import { APPOINTMENT_STATUS_LABELS_AR, AppointmentStatus } from "@/lib/types";
import { cn, formatArabicDate, formatArabicTime } from "@/lib/utils";
import { CalendarX2, MapPin, TimerReset } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusTone: Record<AppointmentStatus, "teal" | "amber" | "success" | "danger" | "neutral"> = {
  booked: "teal",
  checked_in: "amber",
  in_progress: "amber",
  completed: "success",
  cancelled: "danger",
  no_show: "neutral",
};

export default function PatientAppointmentsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  // SUPABASE: supabase.from('appointments').select('*, doctors(*), hospitals(name), departments(name)')
  //   .eq('patient_id', user.id).order('appointment_date', { ascending: tab === 'upcoming' })
  const upcoming = mockAppointments.filter((a) => ["booked", "checked_in", "in_progress"].includes(a.status));
  const past = mockAppointments.filter((a) => ["completed", "cancelled", "no_show"].includes(a.status));
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div>
      <header className="border-b border-line bg-white">
        <div className="container-app py-4">
          <h1 className="font-display text-xl font-bold text-teal-950">مواعيدي</h1>
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-teal-100 p-1">
            <button
              onClick={() => setTab("upcoming")}
              className={cn(
                "rounded-lg py-2 text-sm font-bold transition",
                tab === "upcoming" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700"
              )}
            >
              القادمة
            </button>
            <button
              onClick={() => setTab("past")}
              className={cn(
                "rounded-lg py-2 text-sm font-bold transition",
                tab === "past" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700"
              )}
            >
              السابقة
            </button>
          </div>
        </div>
      </header>

      <div className="container-app space-y-3 py-5">
        {list.length === 0 && (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <CalendarX2 className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">لا توجد مواعيد {tab === "upcoming" ? "قادمة" : "سابقة"}</p>
          </Card>
        )}

        {list.map((appt) => (
          <Card key={appt.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display font-bold text-teal-950">{appt.doctor_name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {appt.hospital_name} · {appt.department_name}
                </p>
              </div>
              <Badge tone={statusTone[appt.status]}>{APPOINTMENT_STATUS_LABELS_AR[appt.status]}</Badge>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <p className="nums text-sm text-slate-600">
                {formatArabicDate(appt.appointment_date)} · {formatArabicTime(appt.scheduled_time)}
              </p>

              {(appt.status === "checked_in" || appt.status === "in_progress") && (
                <Link href={`/patient/queue/${appt.id}`}>
                  <Button size="sm" variant="amber">
                    <TimerReset className="h-4 w-4" /> تتبع الطابور
                  </Button>
                </Link>
              )}
              {appt.status === "booked" && (
                <Button size="sm" variant="ghost" className="text-danger">
                  إلغاء الموعد
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
