"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { mockDepartments, mockDoctors } from "@/lib/mock-data";
import { Doctor } from "@/lib/types";
import { Mail, Plus, Star, X } from "lucide-react";
import { useState } from "react";

export default function HospitalDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", specialty: "", department_id: mockDepartments[0]?.id ?? "", email: "" });

  function update<K extends keyof typeof form>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleAdd() {
    if (!form.name || !form.specialty) return;
    // SUPABASE:
    // 1) invite doctor via supabase.auth.admin.inviteUserByEmail(form.email) [server-side]
    // 2) insert into profiles with role 'doctor'
    // 3) insert into doctors { profile_id, hospital_id, department_id, specialty }
    const dept = mockDepartments.find((d) => d.id === form.department_id);
    const newDoc: Doctor = {
      id: crypto.randomUUID(),
      profile_id: crypto.randomUUID(),
      hospital_id: "h1",
      department_id: form.department_id,
      full_name: form.name,
      title: "أخصائي",
      specialty: form.specialty,
      years_experience: 0,
      consultation_fee: 0,
      avg_consultation_minutes: dept?.avg_consultation_minutes ?? 15,
      rating: 0,
      rating_count: 0,
      is_active: true,
      hospital_name: "مستشفى النور التخصصي",
      department_name: dept?.name,
    };
    setDoctors((d) => [newDoc, ...d]);
    setForm({ name: "", specialty: "", department_id: mockDepartments[0]?.id ?? "", email: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-teal-950">الأطباء</h1>
          <p className="text-sm text-slate-500">أضف الأطباء واربطهم بالأقسام المناسبة</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "إغلاق" : "إضافة طبيب"}
        </Button>
      </div>

      {showForm && (
        <Card className="grid gap-3 p-5 sm:grid-cols-2">
          <Input label="اسم الطبيب" value={form.name} onChange={(e) => update("name", e.target.value)} />
          <Input label="التخصص" value={form.specialty} onChange={(e) => update("specialty", e.target.value)} />
          <Select label="القسم" value={form.department_id} onChange={(e) => update("department_id", e.target.value)}>
            {mockDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
          <Input
            label="البريد الإلكتروني (لإرسال دعوة الدخول)"
            type="email"
            dir="ltr"
            icon={<Mail className="h-4 w-4" />}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <Button onClick={handleAdd} className="sm:col-span-2">
            حفظ وإرسال دعوة
          </Button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doc) => (
          <Card key={doc.id} className="p-5">
            <div className="flex items-center gap-3">
              <Avatar name={doc.full_name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold text-teal-950">{doc.full_name}</p>
                <p className="truncate text-xs text-slate-500">
                  {doc.title} {doc.specialty}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge tone={doc.is_active ? "success" : "neutral"}>{doc.is_active ? "نشط" : "غير نشط"}</Badge>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {doc.rating || "—"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
