"use client";

import { QueueBoard } from "@/components/queue/QueueBoard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { formatWaitMinutes } from "@/lib/utils";
import { ArrowRight, Bell, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PatientQueueTrackingPage({ params }: { params: { appointmentId: string } }) {
  const supabase = createClient();

  // Demo local state standing in for the live ticket — in production this
  // is seeded from the initial query below and then kept in sync by the
  // realtime subscription.
  const [nowServing, setNowServing] = useState(42);
  const [yourNumber] = useState(45);
  const [patientsAhead, setPatientsAhead] = useState(3);
  const avgConsultMinutes = 15;

  useEffect(() => {
    // SUPABASE: initial fetch
    // supabase.from('queue_tickets').select('*, appointments(doctors(profiles(full_name)))')
    //   .eq('appointment_id', params.appointmentId).single()

    // SUPABASE: realtime — listen for queue movement on this doctor's queue
    // const channel = supabase
    //   .channel(`queue-${params.appointmentId}`)
    //   .on(
    //     'postgres_changes',
    //     { event: 'UPDATE', schema: 'public', table: 'queue_tickets', filter: `doctor_id=eq.${doctorId}` },
    //     (payload) => {
    //       if (payload.new.status === 'in_progress') setNowServing(payload.new.queue_number);
    //     }
    //   )
    //   .subscribe();
    // return () => { supabase.removeChannel(channel); };

    const interval = setInterval(() => {
      setNowServing((n) => (n < yourNumber ? n + 1 : n));
      setPatientsAhead((n) => Math.max(0, n - 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [yourNumber]);

  const waitMinutes = patientsAhead * avgConsultMinutes;

  return (
    <div className="min-h-screen bg-paper pb-10">
      <header className="border-b border-line bg-white">
        <div className="container-app flex items-center gap-3 py-4">
          <Link href="/patient/appointments" className="text-teal-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-teal-950">تتبع الطابور المباشر</h1>
        </div>
      </header>

      <div className="container-app space-y-5 py-6">
        <QueueBoard
          nowServing={nowServing}
          yourNumber={yourNumber}
          waitMinutes={waitMinutes}
          doctorName="د. سارة الحربي — الباطنية"
        />

        <div className="grid grid-cols-2 gap-3">
          <Card className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-800">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-slate-500">أمامك في الطابور</p>
              <p className="nums font-display text-lg font-extrabold text-teal-950">{patientsAhead} مرضى</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-slate-500">سنُنبهك عند</p>
              <p className="font-display text-sm font-extrabold text-teal-950">قبل دورك بـ ٢ مريض</p>
            </div>
          </Card>
        </div>

        <Card className="flex items-start gap-3 p-4">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <div>
            <p className="text-sm font-bold text-teal-950">مستشفى النور التخصصي — الطابق الثاني، عيادة الباطنية</p>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              يمكنك الانتظار خارج العيادة، سنُبقيك على اطلاع بموعد دورك تلقائيًا. الوقت المتبقي التقديري: {formatWaitMinutes(waitMinutes)}
            </p>
          </div>
        </Card>

        <div className="flex justify-center">
          <Badge tone="neutral">يتم التحديث تلقائيًا كل بضع ثوانٍ</Badge>
        </div>
      </div>
    </div>
  );
}
