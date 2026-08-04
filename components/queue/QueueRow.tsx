import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QUEUE_STATUS_LABELS_AR, QueueTicket, PRIORITY_LABELS_AR } from "@/lib/types";
import { cn, formatQueueNumber } from "@/lib/utils";
import { AlertTriangle, Phone, Check, SkipForward } from "lucide-react";

const statusTone: Record<string, "teal" | "amber" | "success" | "danger" | "neutral"> = {
  waiting: "neutral",
  called: "amber",
  in_progress: "teal",
  done: "success",
  skipped: "danger",
  cancelled: "danger",
};

export function QueueRow({
  ticket,
  onCall,
  onComplete,
  onSkip,
}: {
  ticket: QueueTicket;
  onCall?: (id: string) => void;
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
}) {
  const isPriority = ticket.priority !== "normal";

  return (
    <div
      className={cn(
        "flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-3 md:gap-4 rounded-xl border p-3 xs:p-4 transition-all hover:shadow-md",
        ticket.status === "called"
          ? "border-amber-300 bg-amber-50/50"
          : "border-slate-200 bg-white hover:border-slate-300"
      )}
      role="listitem"
    >
      {/* Queue number */}
      <div className="nums flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-950 font-mono text-lg font-bold text-amber-500">
        {formatQueueNumber(ticket.queue_number)}
      </div>

      {/* Patient info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar name={ticket.patient_name ?? "مريض"} size={40} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold text-teal-950 text-sm md:text-base">
            {ticket.patient_name ?? "مريض"}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge tone={statusTone[ticket.status]} className="text-xs">
              {QUEUE_STATUS_LABELS_AR[ticket.status]}
            </Badge>
            {isPriority && (
              <Badge tone="priority" className="text-xs">
                <AlertTriangle className="h-3 w-3" />
                {PRIORITY_LABELS_AR[ticket.priority]}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Wait time - hidden on small screens */}
      <div className="hidden md:flex shrink-0 flex-col items-end">
        <p className="text-xs text-slate-600 font-medium">الانتظار المتوقع</p>
        <p className="nums text-sm font-bold text-teal-900">{ticket.estimated_wait_minutes} د</p>
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 gap-2 self-end xs:self-center">
        {ticket.status === "waiting" && onCall && (
          <Button
            size="sm"
            variant="amber"
            onClick={() => onCall(ticket.id)}
            title="استدعاء المريض"
            className="text-xs md:text-sm"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xs:inline">نداء</span>
          </Button>
        )}
        {ticket.status === "called" && onComplete && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onComplete(ticket.id)}
            title="إنهاء الكشف"
            className="text-xs md:text-sm"
          >
            <Check className="h-4 w-4" />
            <span className="hidden xs:inline">إنهاء</span>
          </Button>
        )}
        {(ticket.status === "waiting" || ticket.status === "called") && onSkip && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSkip(ticket.id)}
            title="تخطي المريض"
            aria-label="تخطي"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
