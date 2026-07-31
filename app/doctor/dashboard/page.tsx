"use client";

import { QueueRow } from "@/components/queue/QueueRow";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockQueueToday } from "@/lib/mock-data";
import { QueueTicket } from "@/lib/types";
import { CalendarCheck2, Clock3, Users } from "lucide-react";
import { useState } from "react";

export default function DoctorDashboardPage() {
  // SUPABASE: supabase.from('queue_tickets').select('*, appointments(profiles(full_name), reason)')
  //   .eq('doctor_id', doctorId).eq('queue_date', today).order('queue_number')
  //   + realtime subscription to keep in sync with reception check-ins
  const [tickets, setTickets] = useState<QueueTicket[]>(mockQueueToday.filter((t) => t.doctor_id === "doc1"));

  function callNext(id: string) {
    // SUPABASE: supabase.from('queue_tickets').update({ status: 'called', called_at: new Date() }).eq('id', id)
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "called" } : t)));
  }

  function completeTicket(id: string) {
    // SUPABASE: supabase.from('queue_tickets').update({ status: 'done', completed_at: new Date() }).eq('id', id)
    //           supabase.from('appointments').update({ status: 'completed' }).eq('id', appointmentId)
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "done" } : t)));
  }

  const waiting = tickets.filter((t) => t.status === "waiting").length;
  const done = tickets.filter((t) => t.status === "done").length;
  const current = tickets.find((t) => t.status === "called" || t.status === "in_progress");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-teal-950">قائمة اليوم</h1>
        <p className="text-sm text-slate-500">الأربعاء، ٢٩ يوليو ٢٠٢٦ — عيادة الباطنية</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="مرضى اليوم" value={tickets.length} icon={CalendarCheck2} tone="teal" />
        <StatCard label="بالانتظار" value={waiting} icon={Users} tone="amber" />
        <StatCard label="تم الكشف" value={done} icon={Clock3} tone="success" />
      </div>

      {current && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle>المريض الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <QueueRow ticket={current} onComplete={completeTicket} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>قائمة الانتظار</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tickets
            .filter((t) => t.status === "waiting")
            .map((t) => (
              <QueueRow key={t.id} ticket={t} onCall={callNext} />
            ))}
          {waiting === 0 && <p className="py-6 text-center text-sm text-slate-500">لا يوجد مرضى بالانتظار حاليًا</p>}
        </CardContent>
      </Card>
    </div>
  );
}
