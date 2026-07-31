"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/layout/Logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { KeyRound, Lock, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tab = "patient" | "staff";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("patient");

  // Patient flow: phone + OTP
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Staff flow: email + password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ phone: `+966${phone}` });
    setLoading(false);
    if (error) return setError("تعذر إرسال الرمز، حاول مجددًا");
    setOtpSent(true);
  }

  async function verifyOtp() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({
      phone: `+966${phone}`,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) return setError("رمز التحقق غير صحيح");
    router.push("/patient/dashboard");
  }

  async function staffLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    router.push("/hospital/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-teal-100 p-1">
          <button
            onClick={() => setTab("patient")}
            className={cn(
              "rounded-lg py-2 text-sm font-bold transition",
              tab === "patient" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700"
            )}
          >
            مريض
          </button>
          <button
            onClick={() => setTab("staff")}
            className={cn(
              "rounded-lg py-2 text-sm font-bold transition",
              tab === "staff" ? "bg-white text-teal-900 shadow-soft" : "text-teal-700"
            )}
          >
            مستشفى / طبيب / استقبال
          </button>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          {tab === "patient" ? (
            <div className="space-y-4">
              <h1 className="font-display text-xl font-bold text-teal-950">تسجيل الدخول برقم الجوال</h1>
              <Input
                label="رقم الجوال"
                type="tel"
                dir="ltr"
                placeholder="5xxxxxxxx"
                icon={<Phone className="h-4 w-4" />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={otpSent}
              />
              {otpSent && (
                <Input
                  label="رمز التحقق"
                  type="text"
                  dir="ltr"
                  placeholder="000000"
                  icon={<KeyRound className="h-4 w-4" />}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}
              {error && <p className="text-xs text-danger">{error}</p>}
              <Button
                fullWidth
                loading={loading}
                onClick={otpSent ? verifyOtp : sendOtp}
                disabled={otpSent ? otp.length < 4 : phone.length < 9}
              >
                {otpSent ? "تأكيد الرمز" : "إرسال رمز التحقق"}
              </Button>
              <p className="text-center text-xs text-slate-500">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="font-bold text-teal-800">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="font-display text-xl font-bold text-teal-950">تسجيل دخول الفريق الطبي</h1>
              <Input
                label="البريد الإلكتروني"
                type="email"
                dir="ltr"
                placeholder="name@hospital.sa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="كلمة المرور"
                type="password"
                dir="ltr"
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-xs text-danger">{error}</p>}
              <Button fullWidth loading={loading} onClick={staffLogin}>
                تسجيل الدخول
              </Button>
              <p className="text-center text-xs text-slate-500">
                منشأتك غير مسجلة؟{" "}
                <Link href="/hospital-register" className="font-bold text-teal-800">
                  سجّل مستشفاك
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
