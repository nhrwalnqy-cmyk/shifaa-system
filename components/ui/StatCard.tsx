import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "teal",
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "teal" | "amber" | "success" | "danger";
  trend?: string;
}) {
  const tones = {
    teal: "bg-teal-900 text-white",
    amber: "bg-amber-500 text-teal-950",
    success: "bg-success text-white",
    danger: "bg-danger text-white",
  };
  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 md:p-5">
      <div className={cn("flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl", tones[tone])}>
        <Icon className="h-5 w-5 md:h-6 md:w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs md:text-sm text-slate-600">{label}</p>
        <p className="nums font-display text-xl md:text-2xl font-extrabold text-teal-950 leading-tight">{value}</p>
        {trend && <p className="text-xs text-success font-medium mt-1">{trend}</p>}
      </div>
    </Card>
  );
}
