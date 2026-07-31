"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { mockAppointments, mockDepartments } from "@/lib/mock-data";
import { APPOINTMENT_STATUS_LABELS_AR, AppointmentStatus } from "@/lib/types";
import { formatArabicDate, formatArabicTime } from "@/lib/utils";
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

export default function HospitalAppointmentsPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");

  // SUPABASE: supabase.from('appointments').select('*, profiles(full_name), doctors(profiles(full_name)), departments(name)')
  //   .eq('hospital_id', hospitalId).order('appointment_date')
  const filtered = useMemo(
    () =>
      mockAppointments.filter(
        (a) =>
          (!query || a.doctor_name?.includes(query)) &&
          (!department || a.department_name === department)
      ),
    [query, department]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-teal-950">المواعيد</h1>
        <p className="text-sm text-slate-500">عرض جميع مواعيد المستشفى وحالتها</p>
      </div>

      <Card className="flex flex-col gap-3 p-4 sm:flex-row">
        <Input
          placeholder="ابحث باسم الطبيب"
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:flex-1"
        />
        <Select value={department} onChange={(e) => setDepartment(e.target.value)} className="sm:w-56">
          <option value="">كل الأقسام</option>
          {mockDepartments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-teal-50 text-right text-xs text-teal-800">
              <tr>
                <th className="p-3 font-semibold">المريض</th>
                <th className="p-3 font-semibold">الطبيب</th>
                <th className="p-3 font-semibold">القسم</th>
                <th className="p-3 font-semibold">التاريخ والوقت</th>
                <th className="p-3 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="p-3 font-semibold text-teal-950">{a.patient_name ?? "مريض"}</td>
                  <td className="p-3">{a.doctor_name}</td>
                  <td className="p-3 text-slate-600">{a.department_name}</td>
                  <td className="nums p-3 text-slate-600">
                    {formatArabicDate(a.appointment_date)} · {formatArabicTime(a.scheduled_time)}
                  </td>
                  <td className="p-3">
                    <Badge tone={statusTone[a.status]}>{APPOINTMENT_STATUS_LABELS_AR[a.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
