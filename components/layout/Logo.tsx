import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import Link from "next/link";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-900">
        <Activity className="h-5 w-5 text-amber-500" strokeWidth={2.5} />
      </span>
      <span className={cn("font-display text-xl font-extrabold", dark ? "text-white" : "text-teal-950")}>
        شفاء
      </span>
    </Link>
  );
}
