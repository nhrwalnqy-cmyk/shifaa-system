"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function DoctorProfileEditPage() {
  // SUPABASE: supabase.from('doctors').select('*, profiles(*)').eq('profile_id', user.id).single()
  const [form, setForm] = useState({
    fullName: "د. سارة الحربي",
    specialty: "الباطنية",
    yearsExperience: "15",
    fee: "250",
    bio: "استشارية باطنية بخبرة تفوق ١٥ عامًا في تشخيص وعلاج أمراض الجهاز الهضمي والغدد الصماء.",
  });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    // SUPABASE:
    // supabase.from('doctors').update({ years_experience, consultation_fee, bio }).eq('id', doctorId)
    // supabase.from('profiles').update({ full_name }).eq('id', user.id)
    setSaved(true);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-teal-950">ملفي الشخصي</h1>
        <p className="text-sm text-slate-500">هذه المعلومات تظهر للمرضى عند تصفح ملفك الطبي</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={form.fullName} size={64} />
          <Button variant="outline" size="sm">
            تغيير الصورة
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="الاسم الكامل" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
          <Input label="التخصص" value={form.specialty} onChange={(e) => update("specialty", e.target.value)} />
          <Input
            label="سنوات الخبرة"
            type="number"
            value={form.yearsExperience}
            onChange={(e) => update("yearsExperience", e.target.value)}
          />
          <Input label="رسوم الكشف (ريال)" type="number" value={form.fee} onChange={(e) => update("fee", e.target.value)} />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-teal-950">نبذة تعريفية</label>
          <textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleSave}>حفظ التغييرات</Button>
          {saved && <span className="text-sm font-semibold text-success">تم الحفظ بنجاح</span>}
        </div>
      </Card>
    </div>
  );
}
