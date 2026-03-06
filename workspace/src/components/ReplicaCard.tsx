import { Check, MoreHorizontal, Sparkles } from "lucide-react";

export default function ReplicaCard() {
  return (
    <section className="replica-card relative w-full max-w-[520px]">
      <div className="absolute -inset-px rounded-[28px] opacity-70 [background:radial-gradient(900px_circle_at_20%_0%,rgba(255,105,180,0.25),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(120,135,255,0.22),transparent_52%),radial-gradient(900px_circle_at_40%_100%,rgba(147,51,234,0.18),transparent_56%)]" />
      <div className="relative rounded-[28px] border border-white/15 bg-white/[0.06] px-7 pb-7 pt-6 shadow-[0_30px_70px_rgba(0,0,0,0.60)] backdrop-blur-[16px]">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl border border-white/15 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <Sparkles className="size-5 text-white/90" strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[13px] font-medium tracking-[0.08em] text-white/70">
                PRO UPGRADE
              </div>
              <div className="text-[12px] text-white/40">Unlock premium features</div>
            </div>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white/85 active:scale-[0.98]"
            aria-label="More"
          >
            <MoreHorizontal className="size-[18px]" />
          </button>
        </header>

        <div className="mt-7">
          <h1 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
            Get unlimited access
          </h1>
          <p className="mt-2 text-[14px] leading-[1.55] text-white/55">
            Upgrade to Pro to unlock advanced tools, higher limits, and priority
            features designed for daily work.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <FeatureRow text="Unlimited exports and projects" />
          <FeatureRow text="High-quality rendering and presets" />
          <FeatureRow text="Priority support and early access" />
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[12px] font-medium tracking-[0.14em] text-white/55">
                MONTHLY
              </div>
              <div className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-white">
                $12<span className="text-[14px] font-medium text-white/55">/mo</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-white/50">Cancel anytime</div>
              <div className="mt-1 text-[12px] text-white/35">
                Renews automatically
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="h-11 rounded-2xl border border-white/12 bg-white/[0.03] text-[14px] font-medium text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition hover:bg-white/[0.06] active:scale-[0.99]"
          >
            Not now
          </button>
          <button
            type="button"
            className="h-11 rounded-2xl bg-[linear-gradient(135deg,#8B5CF6_0%,#EC4899_55%,#60A5FA_100%)] text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(236,72,153,0.22)] transition hover:brightness-[1.03] active:scale-[0.99]"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-[2px] grid size-6 place-items-center rounded-full border border-white/10 bg-white/5">
        <Check className="size-[14px] text-white/85" strokeWidth={2.4} />
      </div>
      <div className="text-[14px] leading-[1.45] text-white/70">{text}</div>
    </div>
  );
}
