"use client";

import { cn, formatQueueNumber, formatWaitMinutes } from "@/lib/utils";

/**
 * The signature visual element of Shifaa: a clinic "now serving" LED
 * board, reimagined for the screen. Grounded directly in the subject —
 * every waiting room has one of these on the wall. Deep teal panel,
 * amber segmented digits with a soft glow, tabular numerals.
 */
export function QueueBoard({
  nowServing,
  yourNumber,
  waitMinutes,
  doctorName,
  size = "lg",
}: {
  nowServing: number;
  yourNumber?: number;
  waitMinutes?: number;
  doctorName?: string;
  size?: "sm" | "lg";
}) {
  const isYourTurn = yourNumber !== undefined && yourNumber === nowServing;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-b from-teal-950 to-teal-900 text-white shadow-board",
        size === "lg" ? "p-6 sm:p-8" : "p-4"
      )}
    >
      {/* subtle grid texture, like a real display panel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-teal-200">الرقم الحالي</span>
        {doctorName && (
          <span className="truncate text-xs font-semibold text-teal-200">{doctorName}</span>
        )}
      </div>

      <div
        className={cn(
          "relative mt-2 text-center font-mono font-semibold text-amber-500",
          size === "lg" ? "text-7xl sm:text-8xl" : "text-4xl"
        )}
        style={{ textShadow: "0 0 24px rgba(232,163,61,0.55)" }}
        key={nowServing}
      >
        <span className="animate-digitFlip inline-block nums">{formatQueueNumber(nowServing)}</span>
      </div>

      {yourNumber !== undefined && (
        <div className="relative mt-5 flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs text-teal-200">دورك</p>
            <p className="nums font-mono text-2xl font-bold">{formatQueueNumber(yourNumber)}</p>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div className="text-left">
            <p className="text-xs text-teal-200">وقت الانتظار المتوقع</p>
            <p
              className={cn(
                "font-display text-lg font-bold",
                isYourTurn ? "text-amber-400 animate-pulseSoft" : "text-white"
              )}
            >
              {isYourTurn ? "تفضل الآن" : formatWaitMinutes(waitMinutes ?? 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
