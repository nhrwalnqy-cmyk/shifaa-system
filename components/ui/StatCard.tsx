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
    <Card className="flex items-center gap-4 p-5">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", tones[tone])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="nums font-display text-2xl font-extrabold text-teal-950">{value}</p>
        {trend && <p className="text-xs text-success">{trend}</p>}
      </div>
    </Card>
  );
}
