"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/layout/Logo";
import { createClient } from "@/lib/supabase/client";
import { APPOINTMENT_STATUS_LABELS_AR, AppointmentStatus } from "@/lib/types";
import { formatArabicDate, formatArabicTime } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

interface TrackedAppointment {
  id: string;
  status: AppointmentStatus;
  appointment_date: string;
  scheduled_time: string;
  booking_code: string;
}

export default function TrackAppointmentPage() {
  const supabase = createClient();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackedAppointment | null>(null);

  async function handleSearch() {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    // SUPABASE: public RPC — no login required, matches by booking_code only.
    const { data, error: rpcError } = await supabase.rpc("get_appointment_by_code", {
      p_code: code.trim(),
    });

    setLoading(false);
    if (rpcError || !data || data.length === 0) {
      return setError("لم يتم العثور على حجز بهذا الكود، تأكد من كتابته بشكل صحيح");
    }
    setResult(data[0]);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card className="p-6">
          <h1 className="mb-1 font-display text-xl font-bold text-teal-950">تتبع حجزك</h1>
          <p className="mb-5 text-sm text-slate-500">
            أدخل كود الحجز اللي استلمته عند تأكيد الموعد
          </p>

          <div className="space-y-3">
            <Input
              placeholder="مثال: A3F9K2X1"
              dir="ltr"
              icon={<Search className="h-4 w-4" />}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            {error && <p className="text-xs text-danger">{error}</p>}
            <Button fullWidth loading={loading} onClick={handleSearch}>
              بحث عن الحجز
            </Button>
          </div>

          {result && (
            <div className="mt-6 space-y-3 border-t border-line pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">حالة الحجز</span>
                <Badge tone="teal">{APPOINTMENT_STATUS_LABELS_AR[result.status]}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">التاريخ والوقت</span>
                <span className="nums text-sm font-bold text-teal-950">
                  {formatArabicDate(result.appointment_date)} · {formatArabicTime(result.scheduled_time)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">كود الحجز</span>
                <span className="nums font-mono text-sm font-bold text-amber-600">
                  {result.booking_code}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
