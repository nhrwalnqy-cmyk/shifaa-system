import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Tone = "teal" | "amber" | "success" | "danger" | "priority" | "neutral";

const tones: Record<Tone, string> = {
  teal: "bg-teal-100 text-teal-900 ring-1 ring-teal-200",
  amber: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
  success: "bg-success/15 text-success ring-1 ring-success/30",
  danger: "bg-danger/15 text-danger ring-1 ring-danger/30",
  priority: "bg-priority/15 text-priority ring-1 ring-priority/30",
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

export function Badge({
  tone = "teal",
  className,
  role = "status",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      role={role}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-150",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
