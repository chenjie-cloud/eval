import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  hint?: string;
  delta?: { value: string; tone: "up" | "down" | "flat" };
  icon?: ReactNode;
  className?: string;
};

export default function KpiCard({ label, value, hint, delta, icon, className }: KpiCardProps) {
  const deltaTone =
    delta?.tone === "up"
      ? "text-[color:var(--accent-0)]"
      : delta?.tone === "down"
        ? "text-rose-300"
        : "text-[var(--text-2)]";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 -top-16 h-44 w-44 rounded-full bg-[color:var(--accent-1)] blur-[66px] opacity-10" />
      </div>

      <div className="relative flex items-start justify-between gap-4 px-6 py-5">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-[var(--text-2)]">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="truncate text-2xl font-semibold text-[var(--text-0)]">{value}</p>
            {delta && (
              <span className={cn("text-xs font-semibold tabular-nums", deltaTone)}>{delta.value}</span>
            )}
          </div>
          {hint && <p className="mt-1 text-xs text-[var(--text-2)]">{hint}</p>}
        </div>

        {icon && (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgba(240,248,255,0.10)] bg-[rgba(255,255,255,0.04)] text-[var(--text-1)]">
            {icon}
          </div>
        )}
      </div>
    </section>
  );
}

