import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Tone = "teal" | "amber" | "success" | "danger" | "priority" | "neutral";

const tones: Record<Tone, string> = {
  teal: "bg-teal-100 text-teal-800",
  amber: "bg-amber-100 text-amber-700",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  priority: "bg-priority/10 text-priority",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({
  tone = "teal",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
