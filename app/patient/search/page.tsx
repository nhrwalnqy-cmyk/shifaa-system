"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { MapPin, Search, Star, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";

type Tab = "doctors" | "hospitals";
interface Governorate { id: string; name_ar: string; }
interface District { id: string; governorate_id: string; name_ar: string; }

function SearchPageInner() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("doctors");
  const [query, setQuery] = useState("");
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [governorateId, setGovernorateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("governorates").select("id, name_ar").order("name_ar").then(({ data }) => {
      if (data) setGovernorates(data);
    });
  }, []);

  useEffect(() => {
    setDistrictId("");
    if (!governorateId) return setDistricts([]);
    supabase
      .from("districts")
      .select("id, governorate_id, name_ar")
      .eq("governorate_id", governorateId)
      .order("name_ar")
      .then(({ data }) => setDistricts(data ?? []));
  }, [governorateId]);

  useEffect(() => {
    setLoading(true);
    let hospitalQuery = supabase.from("hospitals").select("*").eq("status", "active");
    if (governorateId) hospitalQuery = hospitalQuery.eq("governorate_id", governorateId);
    if (districtId) hospitalQuery = hospitalQuery.eq("district_id", districtId);
    if (query) hospitalQuery = hospitalQuery.ilike("name", `%${query}%`);

    let doctorQuery = supabase
      .from("doctors")
      .select("*, hospitals(name), departments(name)")
      .eq("is_active", true);
    if (governorateId) doctorQuery = doctorQuery.eq("governorate_id", governorateId);
    if (districtId) doctorQuery = doctorQuery.eq("district_id", districtId);
    if (query) doctorQuery = doctorQuery.ilike("specialty", `%${query}%`);

    Promise.all([hospitalQuery, doctorQuery]).then(([h, d]) => {
      setHospitals(h.data ?? []);
      setDoctors(d.data ?? []);
      setLoading(false);
    });
  }, [governorateId, districtId, query]);

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-app space-y-3 py-4">
          <Input
            placeholder="ابحث عن طبيب أو تخصص أو مستشفى"
            icon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <Select value={governorateId} onChange={(e) => setGovernorateId(e.target.value)}>
              <option value="">كل المحافظات</option>
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>{g.name_ar}</option>
              ))}
            </Select>
            <Select value={districtId} onChange={(e) => setDistrictId(e.target.value)} disabled={!governorateId}>
              <option value="">كل المديريات</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name_ar}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-1 rounded-xl bg-teal-100 p-1">
            <button
              onClick={() => setTab("doctors")}
              className={cn("rounded-lg py-2 text-sm font-bold transition", tab === "doctors" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700")}
            >
              الأطباء
            </button>
            <button
              onClick={() => setTab("hospitals")}
              className={cn("rounded-lg py-2 text-sm font-bold transition", tab === "hospitals" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700")}
            >
              المستشفيات
            </button>
          </div>
        </div>
      </header>

      <div className="container-app space-y-3 py-5">
        {loading && <p className="py-10 text-center text-sm text-slate-400">جارِ البحث...</p>}

        {!loading && tab === "doctors" && doctors.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">لا يوجد أطباء مطابقين حاليًا</p>
        )}
        {!loading && tab === "doctors" &&
          doctors.map((doc) => (
            <Link key={doc.id} href={`/patient/doctors/${doc.id}`}>
              <Card className="flex items-center gap-4 p-4 hover:border-teal-300">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                  <Stethoscope className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-bold text-teal-950">{doc.title} {doc.full_name ?? ""}</p>
                  <p className="text-xs text-slate-500">{doc.specialty} · {doc.hospitals?.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {doc.rating}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

        {!loading && tab === "hospitals" && hospitals.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">لا توجد مستشفيات مطابقة حاليًا</p>
        )}
        {!loading && tab === "hospitals" &&
          hospitals.map((h) => (
            <Card key={h.id} className="flex items-center gap-4 p-4 hover:border-teal-300">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <MapPin className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold text-teal-950">{h.name}</p>
                <p className="text-xs text-slate-500">{h.address}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {h.rating}
              </span>
            </Card>
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
