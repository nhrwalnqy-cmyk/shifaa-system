"use client";

import { QueueRow } from "@/components/queue/QueueRow";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { mockDoctors, mockQueueToday } from "@/lib/mock-data";
import { useMemo, useState } from "react";

export default function HospitalQueuePage() {
  const [doctorId, setDoctorId] = useState("");

  // SUPABASE: supabase.from('queue_tickets').select('*, appointments(profiles(full_name))')
  //   .eq('hospital_id', hospitalId).eq('queue_date', today).order('queue_number')
  //   + realtime subscription on the same filter
  const tickets = useMemo(
    () => (doctorId ? mockQueueToday.filter((q) => q.doctor_id === doctorId) : mockQueueToday),
    [doctorId]
  );

  const waiting = tickets.filter((t) => t.status === "waiting").length;
  const done = tickets.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-teal-950">الطابور المباشر</h1>
          <p className="text-sm text-slate-500">نظرة شاملة على جميع الطوابير في المستشفى الآن</p>
        </div>
        <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-64">
          <option value="">كل الأطباء</option>
          {mockDoctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.full_name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="nums font-display text-2xl font-extrabold text-teal-950">{tickets.length}</p>
          <p className="text-xs text-slate-500">إجمالي اليوم</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="nums font-display text-2xl font-extrabold text-amber-600">{waiting}</p>
          <p className="text-xs text-slate-500">بالانتظار</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="nums font-display text-2xl font-extrabold text-success">{done}</p>
          <p className="text-xs text-slate-500">تم الكشف</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="nums font-display text-2xl font-extrabold text-teal-950">
            {tickets.filter((t) => t.priority !== "normal").length}
          </p>
          <p className="text-xs text-slate-500">حالات أولوية</p>
        </Card>
      </div>

      <div className="space-y-2">
        {tickets.map((t) => (
          <QueueRow key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
}
