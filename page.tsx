"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { mockDepartments, mockDoctors, mockHospitals } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { MapPin, Search, Star, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";

type Tab = "doctors" | "hospitals";

// مكوّن منفصل يستخدم useSearchParams — مغلّف بـ Suspense
function SearchContent() {
  const params = useSearchParams();
  const initialTab = (params.get("tab") as Tab) ?? "doctors";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");

  // SUPABASE (doctors): supabase.from('doctors').select('*, profiles(full_name), hospitals(name), departments(name)')
  //   .ilike('specialty', `%${query}%`)
  const filteredDoctors = useMemo(
    () =>
      mockDoctors.filter(
        (d) =>
          (!query || d.full_name.includes(query) || d.specialty.includes(query)) &&
          (!department || d.department_name === department)
      ),
    [query, department]
  );

  // SUPABASE (hospitals): supabase.from('hospitals').select().eq('status','active').ilike('name', `%${query}%`)
  const filteredHospitals = useMemo(
    () =>
      mockHospitals.filter(
        (h) => (!query || h.name.includes(query)) && (!city || h.city === city)
      ),
    [query, city]
  );

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-app space-y-4 py-4">
          <Input
            placeholder="ابحث عن طبيب أو تخصص أو مستشفى"
            icon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-1 rounded-xl bg-teal-100 p-1">
            <button
              onClick={() => setTab("doctors")}
              className={cn(
                "rounded-lg py-2 text-sm font-bold transition",
                tab === "doctors" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700"
              )}
            >
              الأطباء
            </button>
            <button
              onClick={() => setTab("hospitals")}
              className={cn(
                "rounded-lg py-2 text-sm font-bold transition",
                tab === "hospitals" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700"
              )}
            >
              المستشفيات
            </button>
          </div>

          {tab === "doctors" && (
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: "", label: "كل التخصصات" },
                ...mockDepartments.map((d) => ({ value: d.name, label: d.name })),
              ]}
            />
          )}
          {tab === "hospitals" && (
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={[
                { value: "", label: "كل المدن" },
                ...Array.from(new Set(mockHospitals.map((h) => h.city))).map((c) => ({
                  value: c,
                  label: c,
                })),
              ]}
            />
          )}
        </div>
      </header>

      <div className="container-app py-4">
        {tab === "doctors" ? (
          <div className="space-y-3">
            {filteredDoctors.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">لا توجد نتائج</p>
            )}
            {filteredDoctors.map((doctor) => (
              <Link key={doctor.id} href={`/patient/doctors/${doctor.id}`}>
                <Card className="flex gap-4 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100">
                    <Stethoscope className="h-6 w-6 text-teal-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-teal-950">{doctor.title} {doctor.full_name}</p>
                    <p className="text-sm text-slate-500">{doctor.specialty}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {doctor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {doctor.hospital_name}
                      </span>
                    </div>
                  </div>
                  <Badge variant="teal">{doctor.department_name}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHospitals.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">لا توجد نتائج</p>
            )}
            {filteredHospitals.map((hospital) => (
              <Card key={hospital.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-teal-950">{hospital.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {hospital.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400" />
                    {hospital.rating}
                  </div>
                </div>
                {hospital.open_24h && (
                  <Badge variant="green" className="mt-2">مفتوح 24 ساعة</Badge>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// الصفحة الرئيسية مع Suspense — هذا ما يحل الـ 400
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
