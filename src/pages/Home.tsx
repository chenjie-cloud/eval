import QRCode from "qrcode";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export default function Home() {
  const inputId = useId();
  const hintId = useId();
  const [value, setValue] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "typing" | "generating" | "ready" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const runIdRef = useRef(0);

  const trimmed = useMemo(() => value.trim(), [value]);
  const isEmpty = trimmed.length === 0;

  useEffect(() => {
    if (isEmpty) {
      setQrDataUrl(null);
      setErrorText(null);
      setStatus("idle");
      return;
    }

    setStatus("typing");
    const runId = ++runIdRef.current;

    const timer = window.setTimeout(async () => {
      setStatus("generating");
      setErrorText(null);
      try {
        const url = await QRCode.toDataURL(trimmed, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 320,
          color: {
            dark: "#121212",
            light: "#ffffff",
          },
        });
        if (runId !== runIdRef.current) return;
        setQrDataUrl(url);
        setStatus("ready");
      } catch {
        if (runId !== runIdRef.current) return;
        setQrDataUrl(null);
        setErrorText("生成失败：请尝试缩短内容或移除特殊字符");
        setStatus("error");
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isEmpty, trimmed]);

  return (
    <main className="min-h-dvh bg-paper px-5 py-10 text-ink">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">极简二维码生成器</h1>
            <p className="text-sm text-ink/70">无需注册 · 本地生成 · 可右键保存 PNG</p>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-ink/80">
            粘贴网址（HTTP/HTTPS）或任意文本，停止输入约 1 秒后自动生成二维码。
          </p>
        </header>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-ink/15 bg-white/70 p-4 shadow-paper">
              <label htmlFor={inputId} className="mb-3 block text-sm font-medium text-ink/80">
                粘贴你的网址或文本链接
              </label>
              <textarea
                id={inputId}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="例如：https://example.com 或 任意一段文字"
                aria-describedby={hintId}
                spellCheck={false}
                rows={10}
                className="min-h-[220px] w-full resize-y rounded-xl border border-ink/20 bg-white px-3 py-3 font-mono text-[15px] leading-6 text-ink shadow-inner outline-none transition focus:border-ink/50 focus:ring-2 focus:ring-accent/30"
              />
              <div id={hintId} className="mt-3 flex items-center justify-between gap-3 text-xs text-ink/60">
                <span>不上传、不存储、不追踪。生成在你的浏览器本地完成。</span>
                <span className="tabular-nums">{value.length}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-ink/15 bg-white/70 p-4 shadow-paper">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-ink/80">二维码预览</h2>
                <span className="text-xs text-ink/60" aria-live="polite" aria-atomic="true">
                  {status === "idle" && "等待输入"}
                  {status === "typing" && "停止输入后生成…"}
                  {status === "generating" && "生成中…"}
                  {status === "ready" && "可右键保存"}
                  {status === "error" && "生成失败"}
                </span>
              </div>

              <div
                className="grid place-items-center rounded-xl border border-ink/15 bg-white px-4 py-8 shadow-inner"
                aria-busy={status === "generating"}
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="二维码"
                    className="aspect-square w-full max-w-[320px] select-none rounded-lg border border-ink/15 bg-white shadow-sm"
                    draggable={false}
                  />
                ) : (
                  <div className="grid aspect-square w-full max-w-[320px] place-items-center rounded-lg border border-dashed border-ink/20 bg-paper">
                    <span className="px-6 text-center text-sm leading-6 text-ink/55">
                      {status === "idle" && "在左侧粘贴内容，二维码将自动出现"}
                      {status === "typing" && "停止输入约 1 秒后自动生成"}
                      {status === "generating" && "正在生成二维码…"}
                      {status === "error" && (errorText ?? "生成失败")}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs leading-5 text-ink/60">
                生成后可直接在二维码上右键“另存为图片”。移动端可长按保存（取决于浏览器）。
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 text-xs text-ink/55">
          提示：内容越长，二维码越密集；如需更高扫码容错，建议保持内容简短。
        </footer>
      </div>
    </main>
  );
}
