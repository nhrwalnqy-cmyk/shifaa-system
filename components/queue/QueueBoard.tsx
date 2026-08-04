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
        "relative overflow-hidden rounded-2xl bg-gradient-to-b from-teal-950 to-teal-900 text-white shadow-lg",
        size === "lg" ? "p-4 xs:p-5 sm:p-8" : "p-3 xs:p-4"
      )}
      role="status"
      aria-live="polite"
    >
      {/* subtle grid texture, like a real display panel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-teal-200">الرقم الحالي</span>
        {doctorName && (
          <span className="truncate text-xs font-semibold text-teal-200">{doctorName}</span>
        )}
      </div>

      <div
        className={cn(
          "relative mt-2 xs:mt-3 text-center font-mono font-semibold text-amber-500 leading-none",
          size === "lg"
            ? "text-5xl xs:text-6xl sm:text-7xl md:text-8xl"
            : "text-3xl xs:text-4xl sm:text-5xl"
        )}
        style={{ textShadow: "0 0 16px rgba(232,163,61,0.4)" }}
        key={nowServing}
        aria-label={`الرقم الحالي: ${nowServing}`}
      >
        <span className="animate-digitFlip inline-block nums">{formatQueueNumber(nowServing)}</span>
      </div>

      {yourNumber !== undefined && (
        <div className="relative mt-5 xs:mt-6 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 rounded-xl bg-white/10 px-3 xs:px-4 py-3 xs:py-4 backdrop-blur border border-white/20">
          <div className="flex-1">
            <p className="text-xs text-teal-200 font-medium">دورك</p>
            <p className="nums font-mono text-xl xs:text-2xl font-bold text-white mt-0.5">{formatQueueNumber(yourNumber)}</p>
          </div>
          <div className="hidden xs:block h-10 w-px bg-white/20" />
          <div className="flex-1 xs:text-right">
            <p className="text-xs text-teal-200 font-medium">وقت الانتظار المتوقع</p>
            <p
              className={cn(
                "font-display text-base xs:text-lg font-bold mt-0.5",
                isYourTurn
                  ? "text-amber-300 animate-pulse"
                  : "text-white"
              )}
              aria-live="assertive"
              aria-label={isYourTurn ? "تفضل الآن" : `${formatWaitMinutes(waitMinutes ?? 0)}`}
            >
              {isYourTurn ? "تفضل الآن ⏰" : formatWaitMinutes(waitMinutes ?? 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
