"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Logo } from "@/components/layout/Logo";
import { createClient } from "@/lib/supabase/client";
import { Building2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HospitalRegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    hospitalName: "",
    licenseNumber: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    adminName: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (signUpError || !signUpData.user) {
      setLoading(false);
      return setError("تعذر إنشاء الحساب، تحقق من البريد الإلكتروني");
    }

    await supabase.from("profiles").insert({
      id: signUpData.user.id,
      role: "hospital_admin",
      full_name: form.adminName,
      phone: form.phone,
    });

    const slug = form.hospitalName.trim().toLowerCase().replace(/\s+/g, "-");
    const { data: hospital, error: hospitalError } = await supabase
      .from("hospitals")
      .insert({
        owner_id: signUpData.user.id,
        name: form.hospitalName,
        slug,
        license_number: form.licenseNumber,
        city: form.city,
        address: form.address,
        phone: form.phone,
        email: form.email,
        status: "pending",
      })
      .select()
      .single();

    setLoading(false);
    if (hospitalError) return setError("تعذر تسجيل المنشأة، حاول مجددًا");

    router.push("/hospital/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            <ShieldCheck className="h-3.5 w-3.5" /> يتطلب مراجعة فريق شفاء قبل التفعيل
          </span>
          <h1 className="mt-3 font-display text-xl font-bold text-teal-950">تسجيل منشأة صحية جديدة</h1>
          <p className="mb-6 mt-1 text-sm text-slate-500">
            بعد التسجيل، يمكنك إضافة الأقسام والأطباء وإدارة الطوابير من لوحة تحكم واحدة.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="اسم المستشفى / المركز"
              icon={<Building2 className="h-4 w-4" />}
              value={form.hospitalName}
              onChange={(e) => update("hospitalName", e.target.value)}
              className="sm:col-span-2"
            />
            <Input
              label="رقم الترخيص"
              dir="ltr"
              value={form.licenseNumber}
              onChange={(e) => update("licenseNumber", e.target.value)}
            />
            <Select label="المدينة" value={form.city} onChange={(e) => update("city", e.target.value)}>
              <option value="">اختر المدينة</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
            </Select>
            <Input
              label="العنوان"
              icon={<MapPin className="h-4 w-4" />}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="sm:col-span-2"
            />
            <Input
              label="هاتف المنشأة"
              dir="ltr"
              icon={<Phone className="h-4 w-4" />}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <Input
              label="اسم المسؤول"
              value={form.adminName}
              onChange={(e) => update("adminName", e.target.value)}
            />
            <Input
              label="البريد الإلكتروني للمسؤول"
              type="email"
              dir="ltr"
              icon={<Mail className="h-4 w-4" />}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="sm:col-span-2"
            />
            <Input
              label="كلمة المرور"
              type="password"
              dir="ltr"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="sm:col-span-2"
            />
          </div>

          {error && <p className="mt-4 text-xs text-danger">{error}</p>}

          <Button fullWidth size="lg" className="mt-6" loading={loading} onClick={handleSubmit}>
            إرسال طلب التسجيل
          </Button>

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
