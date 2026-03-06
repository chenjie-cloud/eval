import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function Card({ title, subtitle, actions, children, className }: CardProps) {
  return (
    <section
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow)] backdrop-blur-xl",
        "transition-shadow duration-300 hover:shadow-[0_30px_92px_rgba(0,0,0,0.62)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[color:var(--accent-1)] blur-[70px] opacity-15" />
        <div className="absolute -right-24 top-6 h-72 w-72 rounded-full bg-[color:var(--accent-0)] blur-[82px] opacity-12" />
      </div>

      {(title || subtitle || actions) && (
        <header className="relative flex items-start justify-between gap-4 px-6 pb-3 pt-5">
          <div className="min-w-0">
            {title && <h2 className="truncate text-[15px] font-semibold text-[var(--text-0)]">{title}</h2>}
            {subtitle && <p className="mt-1 truncate text-xs text-[var(--text-2)]">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}

      <div className="relative px-6 pb-6">{children}</div>
    </section>
  );
}

