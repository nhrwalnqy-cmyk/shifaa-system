"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Logo } from "@/components/layout/Logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Check, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = ["رقم الجوال", "رمز التحقق", "بياناتك"];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("male");
  const [city, setCity] = useState("");

  async function handleSendOtp() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ phone: `+966${phone}` });
    setLoading(false);
    if (error) return setError("تعذر إرسال رمز التحقق");
    setStep(1);
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({ phone: `+966${phone}`, token: otp, type: "sms" });
    setLoading(false);
    if (error) return setError("رمز التحقق غير صحيح");
    setStep(2);
  }

  async function handleCompleteProfile() {
    setLoading(true);
    setError("");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return setError("انتهت الجلسة، حاول مجددًا");
    }
    const { error } = await supabase.from("profiles").insert({
      id: userData.user.id,
      role: "patient",
      full_name: fullName,
      phone: `+966${phone}`,
      gender,
      city,
    });
    setLoading(false);
    if (error) return setError("تعذر إنشاء الحساب، حاول مجددًا");
    router.push("/patient/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  i < step ? "bg-success text-white" : i === step ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-700"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className="h-px w-6 bg-line" />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h1 className="mb-1 font-display text-xl font-bold text-teal-950">إنشاء حساب مريض</h1>
          <p className="mb-5 text-sm text-slate-500">{steps[step]}</p>

          {step === 0 && (
            <div className="space-y-4">
              <Input
                label="رقم الجوال"
                type="tel"
                dir="ltr"
                placeholder="5xxxxxxxx"
                icon={<Phone className="h-4 w-4" />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {error && <p className="text-xs text-danger">{error}</p>}
              <Button fullWidth loading={loading} disabled={phone.length < 9} onClick={handleSendOtp}>
                إرسال رمز التحقق
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Input
                label="رمز التحقق المرسل إلى جوالك"
                type="text"
                dir="ltr"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {error && <p className="text-xs text-danger">{error}</p>}
              <Button fullWidth loading={loading} disabled={otp.length < 4} onClick={handleVerifyOtp}>
                تأكيد الرمز
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Input
                label="الاسم الكامل"
                icon={<User className="h-4 w-4" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Select label="الجنس" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </Select>
              <Select label="المدينة" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">اختر المدينة</option>
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
              </Select>
              {error && <p className="text-xs text-danger">{error}</p>}
              <Button fullWidth loading={loading} disabled={!fullName || !city} onClick={handleCompleteProfile}>
                إنشاء الحساب
              </Button>
            </div>
          )}

          <p className="mt-5 text-center text-xs text-slate-500">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-bold text-teal-800">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
