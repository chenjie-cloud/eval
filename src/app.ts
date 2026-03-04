import { debounce } from "./ui/debounce";
import { byId } from "./ui/dom";
import { generateQrPngDataUrl } from "./qr/generate";

type Ui = {
  input: HTMLTextAreaElement;
  clear: HTMLButtonElement;
  img: HTMLImageElement;
  empty: HTMLDivElement;
  error: HTMLDivElement;
  hint: HTMLDivElement;
  count: HTMLDivElement;
  stage: HTMLDivElement;
};

export function createApp(doc: Document) {
  const ui: Ui = {
    input: byId(doc, "qr-input"),
    clear: byId(doc, "qr-clear"),
    img: byId(doc, "qr-img"),
    empty: byId(doc, "qr-empty"),
    error: byId(doc, "qr-error"),
    hint: byId(doc, "qr-hint"),
    count: byId(doc, "qr-count"),
    stage: byId(doc, "qr-img").closest(".previewStage") as HTMLDivElement,
  };

  let lastValue = "";
  let generationId = 0;

  const updateCount = () => {
    ui.count.textContent = `${ui.input.value.length} 字符`;
  };

  const setError = (message: string | null) => {
    if (!message) {
      ui.error.style.display = "none";
      ui.error.textContent = "";
      return;
    }
    ui.error.style.display = "block";
    ui.error.textContent = message;
  };

  const setEmpty = (isEmpty: boolean) => {
    ui.empty.style.display = isEmpty ? "grid" : "none";
    ui.img.style.display = isEmpty ? "none" : "block";
    if (isEmpty) ui.img.removeAttribute("src");
  };

  const stageWidth = () => {
    const w = ui.stage.clientWidth;
    const padded = Math.max(200, w - 40);
    return Math.min(360, padded);
  };

  const runGenerate = async () => {
    const value = ui.input.value;
    lastValue = value;
    updateCount();
    setError(null);

    const trimmed = value.trim();
    if (!trimmed) {
      ui.hint.textContent = "输入后将自动生成二维码（无需点击按钮）";
      setEmpty(true);
      return;
    }

    ui.hint.textContent = value.length > 900 ? "内容较长，二维码会更密集，识别可能变慢" : "已就绪：可直接右键保存二维码图片";
    setEmpty(false);

    const myId = ++generationId;
    try {
      const size = stageWidth();
      const dataUrl = await generateQrPngDataUrl(value, size);
      if (myId !== generationId) return;
      if (ui.input.value !== lastValue) return;
      ui.img.src = dataUrl;
      setError(null);
    } catch (e) {
      if (myId !== generationId) return;
      const message = e instanceof Error ? e.message : "生成失败，请稍后重试";
      setError(message);
      setEmpty(true);
    }
  };

  const debouncedGenerate = debounce(runGenerate, 1000);

  const onInput = () => {
    updateCount();
    setError(null);
    debouncedGenerate();
  };

  ui.input.addEventListener("input", onInput, { passive: true });
  ui.clear.addEventListener("click", () => {
    ui.input.value = "";
    updateCount();
    setError(null);
    setEmpty(true);
    ui.hint.textContent = "粘贴内容后，将在 1 秒内自动生成";
    ui.input.focus();
  });

  const ro = new ResizeObserver(() => {
    if (ui.input.value.trim()) debouncedGenerate();
  });
  ro.observe(ui.stage);

  ui.hint.textContent = "粘贴内容后，将在 1 秒内自动生成";
  updateCount();
  setEmpty(true);
  ui.input.focus();
}

