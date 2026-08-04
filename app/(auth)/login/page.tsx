"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Logo } from "@/components/layout/Logo";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { createClient } from "@/lib/supabase/client";
import { StaffRole } from "@/lib/types";
import { Lock, Mail, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roleRedirect: Record<StaffRole, string> = {
  admin: "/admin/dashboard",
  hospital_admin: "/hospital/dashboard",
  doctor: "/doctor/dashboard",
  receptionist: "/reception/dashboard",
};

function LoginPageInner() {
  const router = useRouter();
  const supabase = createClient();

  const [accountType, setAccountType] = useState<StaffRole>("hospital_admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError || !authData.user) {
        setLoading(false);
        return setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      setLoading(false);
      if (profileError || !profile) return setError("تعذر العثور على بيانات الحساب");

      router.push(roleRedirect[profile.role as StaffRole] ?? "/login");
    } catch (e) {
      setLoading(false);
      setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
      console.error("[LoginPage] Error:", e);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h1 className="mb-2 font-display text-xl md:text-2xl font-bold text-teal-950">
            تسجيل دخول الفريق الطبي
          </h1>
          <p className="mb-6 text-sm text-slate-600">
            تسجيل الدخول متاح فقط للأطباء والمستشفيات ومديري النظام
          </p>

          <div className="space-y-4">
            <Select
              label="نوع الحساب"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as StaffRole)}
            >
              <option value="hospital_admin">مستشفى</option>
              <option value="doctor">طبيب</option>
              <option value="admin">مدير النظام</option>
            </Select>

            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              placeholder="name@example.com"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-label="البريد الإلكتروني"
            />
            <Input
              label="كلمة المرور"
              type="password"
              dir="ltr"
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-label="كلمة المرور"
            />

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-danger">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              fullWidth
              loading={loading}
              disabled={!email || !password || loading}
              onClick={handleLogin}
              aria-busy={loading}
            >
              تسجيل الدخول
            </Button>

            <div className="space-y-2 pt-2">
              <p className="text-center text-xs text-slate-600">
                منشأتك غير مسجلة؟{" "}
                <Link href="/hospital-register" className="font-semibold text-teal-700 hover:text-teal-800">
                  سجّل مستشفاك
                </Link>
              </p>
              <p className="text-center text-xs text-slate-600">
                عايز تحجز موعد؟{" "}
                <Link href="/patient/search" className="font-semibold text-teal-700 hover:text-teal-800">
                  احجز بدون حساب
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ErrorBoundary>
      <LoginPageInner />
    </ErrorBoundary>
  );
}
