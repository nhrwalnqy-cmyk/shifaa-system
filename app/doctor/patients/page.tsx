"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { mockAppointments } from "@/lib/mock-data";
import { APPOINTMENT_STATUS_LABELS_AR, AppointmentStatus } from "@/lib/types";
import { formatArabicDate } from "@/lib/utils";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const statusTone: Record<AppointmentStatus, "teal" | "amber" | "success" | "danger" | "neutral"> = {
  booked: "teal",
  checked_in: "amber",
  in_progress: "amber",
  completed: "success",
  cancelled: "danger",
  no_show: "neutral",
};

export default function DoctorPatientsPage() {
  const [query, setQuery] = useState("");

  // SUPABASE: supabase.from('appointments').select('*, profiles(full_name)').eq('doctor_id', doctorId)
  //   .order('appointment_date', { ascending: false })
  const patients = useMemo(
    () => mockAppointments.filter((a) => !query || (a.patient_name ?? "مريض").includes(query)),
    [query]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-teal-950">قائمة المرضى</h1>
        <p className="text-sm text-slate-500">سجل زيارات مرضاك مع الحالة الحالية لكل موعد</p>
      </div>

      <Input
        placeholder="ابحث باسم المريض"
        icon={<Search className="h-4 w-4" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-2">
        {patients.map((p) => (
          <Card key={p.id} className="flex items-center gap-4 p-4">
            <Avatar name={p.patient_name ?? "مريض"} size={44} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-bold text-teal-950">{p.patient_name ?? "مريض"}</p>
              <p className="truncate text-xs text-slate-500">{p.reason ?? "لا يوجد سبب مسجل"}</p>
            </div>
            <p className="nums hidden text-xs text-slate-500 sm:block">{formatArabicDate(p.appointment_date)}</p>
            <Badge tone={statusTone[p.status]}>{APPOINTMENT_STATUS_LABELS_AR[p.status]}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
