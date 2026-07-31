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
import { Suspense, useMemo, useState } from "react";

type Tab = "doctors" | "hospitals";

function SearchPageInner() {
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

          {tab === "doctors" ? (
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">كل التخصصات</option>
              {mockDepartments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </Select>
          ) : (
            <Select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">كل المدن</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
            </Select>
          )}
        </div>
      </header>

      <div className="container-app space-y-3 py-5">
        {tab === "doctors"
          ? filteredDoctors.map((doc) => (
              <Link key={doc.id} href={`/patient/doctors/${doc.id}`}>
                <Card className="flex items-center gap-4 p-4 hover:border-teal-300">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                    <Stethoscope className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-bold text-teal-950">{doc.full_name}</p>
                    <p className="text-xs text-slate-500">
                      {doc.title} {doc.specialty} · {doc.hospital_name}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {doc.rating}
                      </span>
                      <span className="text-xs text-slate-400">({doc.rating_count} تقييم)</span>
                    </div>
                  </div>
                  <Badge tone="success" className="shrink-0">
                    {doc.next_available}
                  </Badge>
                </Card>
              </Link>
            ))
          : filteredHospitals.map((h) => (
              <Link key={h.id} href={`/patient/search?hospital=${h.slug}`}>
                <Card className="flex items-center gap-4 p-4 hover:border-teal-300">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-bold text-teal-950">{h.name}</p>
                    <p className="text-xs text-slate-500">
                      {h.city} — {h.district}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                      <span>{h.doctors_count} طبيب</span>·<span>{h.departments_count} أقسام</span>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {h.rating}
                  </span>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
    }
