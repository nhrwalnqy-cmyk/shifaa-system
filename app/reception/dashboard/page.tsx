"use client";

import { QueueBoard } from "@/components/queue/QueueBoard";
import { QueueRow } from "@/components/queue/QueueRow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { mockAppointments, mockDoctors, mockQueueToday } from "@/lib/mock-data";
import { PRIORITY_LABELS_AR, PriorityLevel, QueueTicket } from "@/lib/types";
import { AlertTriangle, Search, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";

export default function ReceptionDashboardPage() {
  const [doctorId, setDoctorId] = useState(mockDoctors[0]?.id ?? "");
  const [tickets, setTickets] = useState<QueueTicket[]>(mockQueueToday);
  const [checkInQuery, setCheckInQuery] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("normal");

  const doctor = mockDoctors.find((d) => d.id === doctorId);
  const doctorTickets = tickets.filter((t) => t.doctor_id === doctorId).sort((a, b) => a.queue_number - b.queue_number);
  const nowServing = doctorTickets.find((t) => t.status === "in_progress" || t.status === "called")?.queue_number
    ?? doctorTickets.filter((t) => t.status === "done").slice(-1)[0]?.queue_number
    ?? 0;
  const nextQueueNumber = (doctorTickets.at(-1)?.queue_number ?? 0) + 1;

  // SUPABASE: appointments booked for this doctor today, not yet checked in
  const pendingCheckIns = useMemo(
    () =>
      mockAppointments.filter(
        (a) =>
          a.doctor_id === doctorId &&
          a.status === "booked" &&
          (!checkInQuery || (a.patient_name ?? "").includes(checkInQuery) || a.id.includes(checkInQuery))
      ),
    [doctorId, checkInQuery]
  );

  function checkIn(appointmentId: string, patientName: string) {
    // SUPABASE:
    // await supabase.from('appointments').update({ status: 'checked_in' }).eq('id', appointmentId);
    // -> DB trigger fn_create_queue_ticket() auto-creates the queue_tickets row.
    // Then re-fetch, or optimistically insert like below:
    const newTicket: QueueTicket = {
      id: crypto.randomUUID(),
      appointment_id: appointmentId,
      hospital_id: "h1",
      doctor_id: doctorId,
      queue_date: "2026-07-29",
      queue_number: nextQueueNumber,
      status: "waiting",
      priority,
      estimated_wait_minutes: (doctorTickets.filter((t) => t.status === "waiting").length + 1) * (doctor?.avg_consultation_minutes ?? 15),
      patient_name: patientName,
    };
    setTickets((ts) => [...ts, newTicket]);
    setPriority("normal");
  }

  function callNext(id: string) {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "called" } : t)));
  }
  function completeTicket(id: string) {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "done" } : t)));
  }
  function skipTicket(id: string) {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "skipped" } : t)));
  }

  const waiting = doctorTickets.filter((t) => t.status === "waiting");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-teal-950">لوحة الاستقبال</h1>
          <p className="text-sm text-slate-500">سجّل وصول المرضى وأدر الطابور المباشر</p>
        </div>
        <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-64">
          {mockDoctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.full_name} — {d.specialty}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <QueueBoard nowServing={nowServing} doctorName={doctor?.full_name} size="lg" />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal-700" /> تسجيل وصول مريض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="ابحث باسم المريض أو رقم الحجز"
                icon={<Search className="h-4 w-4" />}
                value={checkInQuery}
                onChange={(e) => setCheckInQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={priority} onChange={(e) => setPriority(e.target.value as PriorityLevel)} className="sm:w-52">
                {Object.entries(PRIORITY_LABELS_AR).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              {pendingCheckIns.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">لا توجد حجوزات مطابقة بانتظار تسجيل الوصول</p>
              )}
              {pendingCheckIns.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-line p-3">
                  <div>
                    <p className="font-semibold text-teal-950">{a.patient_name ?? "مريض"}</p>
                    <p className="text-xs text-slate-500">موعد {a.scheduled_time}</p>
                  </div>
                  <Button size="sm" onClick={() => checkIn(a.id, a.patient_name ?? "مريض")}>
                    تسجيل الوصول
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>قائمة الانتظار ({waiting.length})</CardTitle>
          {waiting.some((t) => t.priority !== "normal") && (
            <Badge tone="priority">
              <AlertTriangle className="h-3 w-3" /> يوجد حالات أولوية
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {doctorTickets
            .filter((t) => t.status === "waiting" || t.status === "called")
            .map((t) => (
              <QueueRow key={t.id} ticket={t} onCall={callNext} onComplete={completeTicket} onSkip={skipTicket} />
            ))}
          {waiting.length === 0 && <p className="py-6 text-center text-sm text-slate-500">لا يوجد مرضى بالانتظار حاليًا</p>}
        </CardContent>
      </Card>
    </div>
  );
}
