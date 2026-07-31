"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DoctorSchedule, WEEKDAY_LABELS_AR, Weekday } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([
    { id: "s1", doctor_id: "doc1", day_of_week: "sun", start_time: "09:00", end_time: "13:00", slot_minutes: 15, is_active: true },
    { id: "s2", doctor_id: "doc1", day_of_week: "tue", start_time: "16:00", end_time: "20:00", slot_minutes: 15, is_active: true },
    { id: "s3", doctor_id: "doc1", day_of_week: "thu", start_time: "09:00", end_time: "13:00", slot_minutes: 15, is_active: true },
  ]);

  const [day, setDay] = useState<Weekday>("sun");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("13:00");

  function handleAdd() {
    // SUPABASE: supabase.from('doctor_schedules').insert({ doctor_id, day_of_week: day, start_time: start, end_time: end })
    setSchedules((s) => [
      ...s,
      { id: crypto.randomUUID(), doctor_id: "doc1", day_of_week: day, start_time: start, end_time: end, slot_minutes: 15, is_active: true },
    ]);
  }

  function handleDelete(id: string) {
    // SUPABASE: supabase.from('doctor_schedules').delete().eq('id', id)
    setSchedules((s) => s.filter((sch) => sch.id !== id));
  }

  function toggleUnavailableToday() {
    // SUPABASE: supabase.from('schedule_exceptions').insert({ doctor_id, date: today, is_unavailable: true, reason })
    alert("تم تسجيل عدم التوفر لهذا اليوم — سيتم إشعار المرضى المحجوزين");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-teal-950">أوقات الدوام</h1>
          <p className="text-sm text-slate-500">حدد أوقات توفرك الأسبوعية للحجز</p>
        </div>
        <Button variant="outline" onClick={toggleUnavailableToday}>
          تسجيل عدم توفر اليوم
        </Button>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-display font-bold text-teal-950">إضافة وقت دوام</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          <Select label="اليوم" value={day} onChange={(e) => setDay(e.target.value as Weekday)}>
            {weekdays.map((w) => (
              <option key={w} value={w}>
                {WEEKDAY_LABELS_AR[w]}
              </option>
            ))}
          </Select>
          <Input label="من الساعة" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input label="إلى الساعة" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          <div className="flex items-end">
            <Button fullWidth onClick={handleAdd}>
              <Plus className="h-4 w-4" /> إضافة
            </Button>
          </div>
        </div>
      </Card>

      <Card className="divide-y divide-line overflow-hidden">
        {schedules.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4">
            <span className="font-semibold text-teal-950">{WEEKDAY_LABELS_AR[s.day_of_week]}</span>
            <span className="nums text-sm text-slate-600">
              {s.start_time} - {s.end_time}
            </span>
            <button onClick={() => handleDelete(s.id)} className="text-slate-300 hover:text-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}
