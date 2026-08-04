"use client";

import { QueueRow } from "@/components/queue/QueueRow";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { mockQueueToday } from "@/lib/mock-data";
import { QueueTicket } from "@/lib/types";
import { CalendarCheck2, Clock3, Users } from "lucide-react";
import { useState, useMemo, useCallback } from "react";

function DoctorDashboardPageInner() {
  // SUPABASE: supabase.from('queue_tickets').select('*, appointments(profiles(full_name), reason)')
  //   .eq('doctor_id', doctorId).eq('queue_date', today).order('queue_number')
  //   + realtime subscription to keep in sync with reception check-ins
  const [tickets, setTickets] = useState<QueueTicket[]>(mockQueueToday.filter((t) => t.doctor_id === "doc1"));

  const callNext = useCallback((id: string) => {
    // SUPABASE: supabase.from('queue_tickets').update({ status: 'called', called_at: new Date() }).eq('id', id)
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "called" } : t)));
  }, []);

  const completeTicket = useCallback((id: string) => {
    // SUPABASE: supabase.from('queue_tickets').update({ status: 'done', completed_at: new Date() }).eq('id', id)
    //           supabase.from('appointments').update({ status: 'completed' }).eq('id', appointmentId)
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "done" } : t)));
  }, []);

  // Memoize filtered results to prevent unnecessary re-renders
  const stats = useMemo(() => {
    const waiting = tickets.filter((t) => t.status === "waiting").length;
    const done = tickets.filter((t) => t.status === "done").length;
    const current = tickets.find((t) => t.status === "called" || t.status === "in_progress");
    return { waiting, done, current };
  }, [tickets]);

  const waitingTickets = useMemo(
    () => tickets.filter((t) => t.status === "waiting"),
    [tickets]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-extrabold text-teal-950">قائمة اليوم</h1>
        <p className="text-xs md:text-sm text-slate-600">الأربعاء، ٢٩ يوليو ٢٠٢٦ — عيادة الباطنية</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="مرضى اليوم" value={tickets.length} icon={CalendarCheck2} tone="teal" />
        <StatCard label="بالانتظار" value={stats.waiting} icon={Users} tone="amber" />
        <StatCard label="تم الكشف" value={stats.done} icon={Clock3} tone="success" />
      </div>

      {stats.current && (
        <Card className="border-amber-300 bg-amber-50/50 border-l-4">
          <CardHeader>
            <CardTitle className="text-amber-900">المريض الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <QueueRow ticket={stats.current} onComplete={completeTicket} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>قائمة الانتظار</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {waitingTickets.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">لا يوجد مرضى بالانتظار حاليًا</p>
            </div>
          )}
          {waitingTickets.map((t) => (
            <QueueRow key={t.id} ticket={t} onCall={callNext} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <ErrorBoundary>
      <DoctorDashboardPageInner />
    </ErrorBoundary>
  );
}
