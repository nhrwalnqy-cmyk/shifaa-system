import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockDoctors } from "@/lib/mock-data";
import { WEEKDAY_LABELS_AR } from "@/lib/types";
import { ArrowRight, Award, MapPin, Star, Stethoscope } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const demoSchedule = [
  { day: "sun", hours: "٩:٠٠ ص - ١:٠٠ م" },
  { day: "tue", hours: "٤:٠٠ م - ٨:٠٠ م" },
  { day: "thu", hours: "٩:٠٠ ص - ١:٠٠ م" },
] as const;

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  // SUPABASE: supabase.from('doctors').select('*, profiles(*), hospitals(*), departments(*), doctor_schedules(*)').eq('id', params.id).single()
  const doctor = mockDoctors.find((d) => d.id === params.id);
  if (!doctor) return notFound();

  return (
    <div className="pb-28">
      <header className="border-b border-line bg-white">
        <div className="container-app flex items-center gap-3 py-4">
          <Link href="/patient/search" className="text-teal-900">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-teal-950">الملف الطبي</h1>
        </div>
      </header>

      <div className="container-app space-y-6 py-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
              <Stethoscope className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-extrabold text-teal-950">{doctor.full_name}</h2>
              <p className="text-sm text-slate-500">
                {doctor.title} {doctor.specialty}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {doctor.rating}
                </span>
                <span className="text-xs text-slate-400">({doctor.rating_count} تقييم)</span>
                <Badge tone="teal">
                  <Award className="h-3 w-3" /> {doctor.years_experience} سنة خبرة
                </Badge>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">{doctor.bio}</p>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 p-3 text-sm text-teal-800">
            <MapPin className="h-4 w-4 shrink-0" />
            {doctor.hospital_name}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-bold text-teal-950">مواعيد العيادة</h3>
          <div className="mt-3 space-y-2">
            {demoSchedule.map((s) => (
              <div key={s.day} className="flex items-center justify-between rounded-lg bg-teal-50/60 px-3 py-2 text-sm">
                <span className="font-semibold text-teal-900">{WEEKDAY_LABELS_AR[s.day]}</span>
                <span className="nums text-slate-600">{s.hours}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-slate-500">رسوم الكشف</p>
            <p className="nums font-display text-lg font-extrabold text-teal-950">{doctor.consultation_fee} ريال</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">مدة الكشف التقريبية</p>
            <p className="nums font-display text-lg font-extrabold text-teal-950">{doctor.avg_consultation_minutes} دقيقة</p>
          </div>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-16 border-t border-line bg-white/95 p-4 backdrop-blur sm:bottom-0">
        <div className="container-app">
          <Link href={`/patient/book/${doctor.id}`}>
            <Button fullWidth size="lg">
              احجز موعدًا — القادم {doctor.next_available}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
