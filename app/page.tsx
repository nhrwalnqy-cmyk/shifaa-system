import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/layout/Logo";
import { CalendarCheck2, Hospital, Search, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
        <div className="container-app flex items-center justify-between py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/track">
              <Button variant="ghost" size="sm">تتبع حجزك</Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm">دخول الفريق الطبي</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container-app py-14 text-center sm:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1.5 text-xs font-bold text-teal-800">
          <ShieldCheck className="h-3.5 w-3.5" /> منصة صحية يمنية لحجز المواعيد ومتابعة الطابور
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.15] text-teal-950 sm:text-5xl">
          احجز موعدك بدون حساب،
          <br />
          <span className="text-amber-500">وتابع دورك بكود الحجز</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-8 text-slate-600">
          اختر محافظتك، ابحث عن أقرب مستشفى أو طبيب، واحجز موعدك مباشرة — بدون تسجيل أو رقم تحقق.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link href="/patient/search">
            <Card className="flex h-full flex-col items-center gap-3 p-6 text-center hover:border-teal-300">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <CalendarCheck2 className="h-7 w-7" />
              </span>
              <p className="font-display text-lg font-bold text-teal-950">احجز موعد كمريض</p>
              <p className="text-xs text-slate-500">بدون حساب، بياناتك تُحفظ عند أول حجز فقط</p>
            </Card>
          </Link>
          <Link href="/login">
            <Card className="flex h-full flex-col items-center gap-3 p-6 text-center hover:border-teal-300">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Stethoscope className="h-7 w-7" />
              </span>
              <p className="font-display text-lg font-bold text-teal-950">دخول الطبيب</p>
              <p className="text-xs text-slate-500">إدارة مواعيدك وقائمة مرضاك</p>
            </Card>
          </Link>
          <Link href="/hospital-register">
            <Card className="flex h-full flex-col items-center gap-3 p-6 text-center hover:border-teal-300">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <Hospital className="h-7 w-7" />
              </span>
              <p className="font-display text-lg font-bold text-teal-950">دخول / تسجيل المستشفى</p>
              <p className="text-xs text-slate-500">أدر أقسامك وأطباءك وطوابيرك</p>
            </Card>
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-white py-10">
        <div className="container-app flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <p className="text-xs text-slate-500">© ٢٠٢٦ شفاء — اليمن. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
