import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/layout/Logo";
import { QueueBoard } from "@/components/queue/QueueBoard";
import {
  Building2,
  CalendarCheck2,
  ClipboardList,
  Hospital,
  MapPin,
  Search,
  Stethoscope,
  UserRound,
  Bell,
  TimerReset,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* ---------------- Nav ---------------- */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
        <div className="container-app flex items-center justify-between py-4">
          <Logo />
          <nav className="hidden items-center gap-8 sm:flex">
            <a href="#how" className="text-sm font-semibold text-teal-950/80 hover:text-teal-950">كيف يعمل</a>
            <a href="#roles" className="text-sm font-semibold text-teal-950/80 hover:text-teal-950">لكل مستخدم</a>
            <a href="#hospitals" className="text-sm font-semibold text-teal-950/80 hover:text-teal-950">للمستشفيات</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">تسجيل الدخول</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">إنشاء حساب</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="container-app grid gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1.5 text-xs font-bold text-teal-800">
            <ShieldCheck className="h-3.5 w-3.5" /> منصة صحية موثوقة لحجز المواعيد والطوابير
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.15] text-teal-950 sm:text-5xl">
            احجز موعدك،
            <br />
            وتابع دورك <span className="text-amber-500">لحظة بلحظة</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-8 text-slate-600">
            لا مزيد من الانتظار في الممرات دون معرفة موعد دورك. شفاء يوصلك بأقرب مستشفى، يحجز موعدك مع الطبيب المناسب، ويُبقيك على اطلاع بترتيبك في الطابور أولاً بأول.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg">ابدأ كمريض</Button>
            </Link>
            <Link href="/hospital-register">
              <Button size="lg" variant="outline">
                <Hospital className="h-4 w-4" /> سجّل منشأتك الصحية
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div>
              <p className="font-display text-2xl font-extrabold text-teal-950">+320</p>
              <p className="text-xs text-slate-500">مستشفى ومركز</p>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <p className="font-display text-2xl font-extrabold text-teal-950">+4,100</p>
              <p className="text-xs text-slate-500">طبيب مسجّل</p>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <p className="font-display text-2xl font-extrabold text-teal-950">-68%</p>
              <p className="text-xs text-slate-500">متوسط وقت الانتظار</p>
            </div>
          </div>
        </div>

        {/* Signature element: the live queue board */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-teal-100/60 blur-2xl" />
          <QueueBoard nowServing={42} yourNumber={45} waitMinutes={18} doctorName="د. سارة الحربي — الباطنية" />
          <Card className="mt-4 flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-teal-950">سيصلك تنبيه قبل دورك بـ ٣ مرضى</p>
              <p className="text-xs text-slate-500">يمكنك الانتظار في أي مكان تريحه، وسنُعلمك في الوقت المناسب</p>
            </div>
          </Card>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="bg-teal-950 py-16 text-white sm:py-24">
        <div className="container-app">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">كيف يعمل شفاء</h2>
          <p className="mt-3 max-w-lg text-teal-200">من البحث عن الطبيب إلى مغادرة العيادة، أربع خطوات بسيطة تُبقيك في الصورة طوال الوقت.</p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: "ابحث", desc: "اختر التخصص أو المستشفى أو الطبيب الأقرب لك" },
              { icon: CalendarCheck2, title: "احجز", desc: "اختر الموعد المناسب من جدول الطبيب الفعلي" },
              { icon: ClipboardList, title: "سجّل وصولك", desc: "امسح رمز الوصول عند وصولك واستلم رقم دورك" },
              { icon: TimerReset, title: "تابع دورك", desc: "راقب الرقم الحالي ووقت انتظارك المتوقع مباشرة" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="rounded-2xl bg-white/5 p-6">
                <span className="font-mono text-xs text-amber-500">{`0${i + 1}`}</span>
                <Icon className="mt-3 h-7 w-7 text-amber-500" />
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-teal-200">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Roles ---------------- */}
      <section id="roles" className="container-app py-16 sm:py-24">
        <h2 className="font-display text-3xl font-extrabold text-teal-950 sm:text-4xl">منصة واحدة، لكل من يخدم رحلة المريض</h2>
        <p className="mt-3 max-w-lg text-slate-600">أدوات مصممة خصيصًا لكل دور — بلا تعقيد، وبواجهة عربية كاملة.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: UserRound,
              title: "المريض",
              desc: "ابحث، احجز، وتابع دورك في الطابور من هاتفك",
              href: "/register",
              cta: "احجز موعدك",
            },
            {
              icon: Building2,
              title: "المستشفى",
              desc: "أدر الأقسام والأطباء والجداول والطوابير من لوحة واحدة",
              href: "/hospital-register",
              cta: "سجّل منشأتك",
            },
            {
              icon: Stethoscope,
              title: "الطبيب",
              desc: "تابع قائمة مرضاك اليومية وأدر مواعيدك بسهولة",
              href: "/login",
              cta: "دخول الأطباء",
            },
            {
              icon: ClipboardList,
              title: "موظف الاستقبال",
              desc: "سجّل وصول المرضى ونادِ التالي في الطابور بضغطة واحدة",
              href: "/login",
              cta: "دخول الاستقبال",
            },
          ].map(({ icon: Icon, title, desc, href, cta }) => (
            <Card key={title} className="flex flex-col p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-teal-950">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{desc}</p>
              <Link href={href} className="mt-5 text-sm font-bold text-teal-700 hover:text-teal-900">
                {cta} ←
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- For hospitals ---------------- */}
      <section id="hospitals" className="container-app pb-16 sm:pb-24">
        <Card className="grid gap-8 overflow-hidden p-8 sm:grid-cols-2 sm:p-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
              <MapPin className="h-3.5 w-3.5" /> لإدارات المستشفيات والمراكز الطبية
            </span>
            <h2 className="mt-4 font-display text-2xl font-extrabold text-teal-950 sm:text-3xl">
              نظّم أقسامك وأطباءك، وقلّل الازدحام في الاستقبال
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              يمنحك شفاء لوحة تحكم كاملة لإدارة الأقسام والأطباء والجداول، مع طابور ذكي يوزّع المرضى تلقائيًا حسب الأولوية ومتوسط زمن الكشف — ويمنح فريق الاستقبال أدوات نداء وتسجيل وصول فورية.
            </p>
            <Link href="/hospital-register" className="mt-6 inline-block">
              <Button size="lg" variant="primary">
                <Hospital className="h-4 w-4" /> سجّل مستشفاك الآن
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-teal-50 p-6">
            <div className="grid w-full max-w-xs grid-cols-2 gap-3">
              {[
                { label: "بالانتظار", value: "12" },
                { label: "تم الكشف اليوم", value: "84" },
                { label: "متوسط الانتظار", value: "9 د" },
                { label: "معدل الرضا", value: "٤٫٧" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white p-4 text-center shadow-soft">
                  <p className="nums font-display text-xl font-extrabold text-teal-900">{s.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-line bg-white py-10">
        <div className="container-app flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <p className="text-xs text-slate-500">© ٢٠٢٦ شفاء. جميع الحقوق محفوظة.</p>
          <div className="flex gap-5 text-xs font-semibold text-slate-500">
            <a href="#" className="hover:text-teal-900">سياسة الخصوصية</a>
            <a href="#" className="hover:text-teal-900">الشروط والأحكام</a>
            <a href="#" className="hover:text-teal-900">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
