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
        "flex items-center gap-4 rounded-xl border p-3 sm:p-4 transition",
        ticket.status === "called" ? "border-amber-400 bg-amber-50" : "border-line bg-white"
      )}
    >
      <div className="nums flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-950 font-mono text-lg font-bold text-amber-500">
        {formatQueueNumber(ticket.queue_number)}
      </div>

      <Avatar name={ticket.patient_name ?? "مريض"} size={40} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-teal-950">{ticket.patient_name ?? "مريض"}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge tone={statusTone[ticket.status]}>{QUEUE_STATUS_LABELS_AR[ticket.status]}</Badge>
          {isPriority && (
            <Badge tone="priority">
              <AlertTriangle className="h-3 w-3" />
              {PRIORITY_LABELS_AR[ticket.priority]}
            </Badge>
          )}
        </div>
      </div>

      <div className="hidden shrink-0 flex-col items-end sm:flex">
        <p className="text-xs text-slate-500">الانتظار المتوقع</p>
        <p className="nums text-sm font-bold text-teal-900">{ticket.estimated_wait_minutes} د</p>
      </div>

      <div className="flex shrink-0 gap-2">
        {ticket.status === "waiting" && onCall && (
          <Button size="sm" variant="amber" onClick={() => onCall(ticket.id)}>
            <Phone className="h-4 w-4" /> نداء
          </Button>
        )}
        {ticket.status === "called" && onComplete && (
          <Button size="sm" variant="primary" onClick={() => onComplete(ticket.id)}>
            <Check className="h-4 w-4" /> إنهاء
          </Button>
        )}
        {(ticket.status === "waiting" || ticket.status === "called") && onSkip && (
          <Button size="sm" variant="ghost" onClick={() => onSkip(ticket.id)}>
            <SkipForward className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
