"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { createClient } from "@/lib/supabase/client";
import { cn, debounce } from "@/lib/utils";
import { MapPin, Search, Star, Stethoscope, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState, useRef } from "react";

type Tab = "doctors" | "hospitals";
interface Governorate { id: string; name_ar: string; }
interface District { id: string; governorate_id: string; name_ar: string; }

const Skeleton = () => (
  <div className="animate-pulse space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4">
        <div className="h-14 w-14 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

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
  const [error, setError] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load governorates once on mount
  useEffect(() => {
    const loadGovernorates = async () => {
      try {
        const { data, error: err } = await supabase
          .from("governorates")
          .select("id, name_ar")
          .order("name_ar");
        if (err) throw err;
        setGovernorates(data || []);
      } catch (e) {
        console.error("[SearchPage] Error loading governorates:", e);
        setError("خطأ في تحميل المحافظات");
      }
    };
    loadGovernorates();
  }, [supabase]);

  // Load districts when governorate changes
  useEffect(() => {
    setDistrictId("");
    if (!governorateId) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      try {
        const { data, error: err } = await supabase
          .from("districts")
          .select("id, governorate_id, name_ar")
          .eq("governorate_id", governorateId)
          .order("name_ar");
        if (err) throw err;
        setDistricts(data || []);
      } catch (e) {
        console.error("[SearchPage] Error loading districts:", e);
      }
    };
    loadDistricts();
  }, [governorateId, supabase]);

  // Debounced search with cleanup
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    setLoading(true);
    setError("");

    searchTimeoutRef.current = setTimeout(async () => {
      try {
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

        const [{ data: hData, error: hError }, { data: dData, error: dError }] = await Promise.all([
          hospitalQuery,
          doctorQuery,
        ]);

        if (hError) throw hError;
        if (dError) throw dError;

        setHospitals(hData || []);
        setDoctors(dData || []);
      } catch (e) {
        console.error("[SearchPage] Search error:", e);
        setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [governorateId, districtId, query, supabase]);

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="container-app space-y-3 py-4 px-3 md:px-0">
          <Input
            placeholder="ابحث عن طبيب أو تخصص أو مستشفى"
            icon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="حقل البحث"
          />

          <div className="grid grid-cols-2 gap-2">
            <Select
              value={governorateId}
              onChange={(e) => setGovernorateId(e.target.value)}
              label="المحافظة"
            >
              <option value="">كل المحافظات</option>
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>{g.name_ar}</option>
              ))}
            </Select>
            <Select
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              label="المديرية"
              disabled={!governorateId}
            >
              <option value="">كل المديريات</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name_ar}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-1 rounded-lg bg-teal-100 p-1">
            <button
              onClick={() => setTab("doctors")}
              className={cn(
                "rounded-lg py-2.5 text-sm font-bold transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
                tab === "doctors"
                  ? "bg-white text-teal-900 shadow-md"
                  : "text-teal-700 hover:bg-teal-200/50"
              )}
            >
              الأطباء
            </button>
            <button
              onClick={() => setTab("hospitals")}
              className={cn(
                "rounded-lg py-2.5 text-sm font-bold transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
                tab === "hospitals"
                  ? "bg-white text-teal-900 shadow-md"
                  : "text-teal-700 hover:bg-teal-200/50"
              )}
            >
              المستشفيات
            </button>
          </div>
        </div>
      </header>

      <div className="container-app space-y-3 py-5 px-3 md:px-0">
        {error && (
          <div className="flex items-center gap-3 rounded-lg bg-danger/10 p-4 text-danger">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && <Skeleton />}

        {!loading && tab === "doctors" && doctors.length === 0 && !query && !governorateId && (
          <p className="py-10 text-center text-sm text-slate-500">ابدأ البحث عن طبيب أو تخصص</p>
        )}
        {!loading && tab === "doctors" && doctors.length === 0 && (query || governorateId) && (
          <p className="py-10 text-center text-sm text-slate-500">لا يوجد أطباء مطابقين حاليًا</p>
        )}
        {!loading && tab === "doctors" &&
          doctors.map((doc) => (
            <Link key={doc.id} href={`/patient/doctors/${doc.id}`}>
              <Card className="flex items-start md:items-center gap-3 md:gap-4 p-4 transition-all hover:shadow-md">
                <span className="flex h-12 md:h-14 w-12 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                  <Stethoscope className="h-5 md:h-6 w-5 md:w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-bold text-teal-950 text-sm md:text-base">
                    {doc.title} {doc.full_name ?? ""}
                  </p>
                  <p className="text-xs text-slate-600">{doc.specialty} · {doc.hospitals?.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="h-3 md:h-3.5 w-3 md:w-3.5 fill-amber-500 text-amber-500" /> {doc.rating || "4.5"}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

        {!loading && tab === "hospitals" && hospitals.length === 0 && !query && !governorateId && (
          <p className="py-10 text-center text-sm text-slate-500">ابدأ البحث عن مستشفى</p>
        )}
        {!loading && tab === "hospitals" && hospitals.length === 0 && (query || governorateId) && (
          <p className="py-10 text-center text-sm text-slate-500">لا توجد مستشفيات مطابقة حاليًا</p>
        )}
        {!loading && tab === "hospitals" &&
          hospitals.map((h) => (
            <Card key={h.id} className="flex items-start md:items-center gap-3 md:gap-4 p-4 transition-all hover:shadow-md">
              <span className="flex h-12 md:h-14 w-12 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <MapPin className="h-5 md:h-6 w-5 md:w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold text-teal-950 text-sm md:text-base">{h.name}</p>
                <p className="text-xs text-slate-600">{h.address}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="h-3 md:h-3.5 w-3 md:w-3.5 fill-amber-500 text-amber-500" /> {h.rating || "4.0"}
              </span>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Skeleton />}>
        <SearchPageInner />
      </Suspense>
    </ErrorBoundary>
  );
}
