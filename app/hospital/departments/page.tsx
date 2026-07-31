"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { mockDepartments } from "@/lib/mock-data";
import { Department } from "@/lib/types";
import { Building2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function HospitalDepartmentsPage() {
  const supabase = createClient();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [avgMinutes, setAvgMinutes] = useState("15");

  async function handleAdd() {
    if (!name) return;
    // SUPABASE: supabase.from('departments').insert({ hospital_id, name, avg_consultation_minutes: Number(avgMinutes) }).select().single()
    const newDept: Department = {
      id: crypto.randomUUID(),
      hospital_id: "h1",
      name,
      icon: "stethoscope",
      avg_consultation_minutes: Number(avgMinutes) || 15,
      doctors_count: 0,
    };
    setDepartments((d) => [newDept, ...d]);
    setName("");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    // SUPABASE: supabase.from('departments').delete().eq('id', id)
    setDepartments((d) => d.filter((dep) => dep.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-teal-950">الأقسام</h1>
          <p className="text-sm text-slate-500">أضف الأقسام الطبية وحدد متوسط زمن الكشف لكل قسم</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "إغلاق" : "إضافة قسم"}
        </Button>
      </div>

      {showForm && (
        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
          <Input label="اسم القسم" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
          <Input
            label="متوسط زمن الكشف (دقيقة)"
            type="number"
            value={avgMinutes}
            onChange={(e) => setAvgMinutes(e.target.value)}
            className="w-full sm:w-48"
          />
          <Button onClick={handleAdd}>حفظ القسم</Button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dep) => (
          <Card key={dep.id} className="p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                <Building2 className="h-5 w-5" />
              </span>
              <button onClick={() => handleDelete(dep.id)} className="text-slate-300 hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 font-display font-bold text-teal-950">{dep.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              {dep.doctors_count ?? 0} طبيب · متوسط الكشف {dep.avg_consultation_minutes} دقيقة
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
