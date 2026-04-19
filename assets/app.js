import { qrcode } from "./vendor/qrcode.mjs";
import { stringToBytes } from "./vendor/qrcode_UTF8.mjs";

qrcode.stringToBytes = stringToBytes;

const $payload = document.getElementById("payload");
const $state = document.getElementById("state");
const $img = document.getElementById("qrImage");
const $count = document.getElementById("count");
const $hint = document.getElementById("hint");
const $download = document.getElementById("download");

const encoder = new TextEncoder();

const debounceMs = 1000;
let timer = null;
let lastToken = 0;

const setState = (text) => {
  $state.textContent = text;
};

const clearPreview = () => {
  $img.removeAttribute("src");
  $img.style.display = "none";
  $download.hidden = true;
  $download.href = "#";
};

const setPreview = (dataUrl) => {
  $img.src = dataUrl;
  $img.style.display = "block";
  $download.hidden = false;
  $download.href = dataUrl;
};

const pickErrorCorrection = (bytes) => {
  if (bytes <= 220) return "Q";
  return "M";
};

const makePngDataUrl = (text, sizePx) => {
  const bytes = encoder.encode(text);
  const level = pickErrorCorrection(bytes.length);

  const qr = qrcode(0, level);
  qr.addData(text);
  qr.make();

  const marginModules = 4;
  const modules = qr.getModuleCount();
  const scale = Math.max(1, Math.floor(sizePx / (modules + marginModules * 2)));
  const canvasSize = scale * (modules + marginModules * 2);

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#000000";

  for (let r = 0; r < modules; r += 1) {
    for (let c = 0; c < modules; c += 1) {
      if (!qr.isDark(r, c)) continue;
      ctx.fillRect(
        (c + marginModules) * scale,
        (r + marginModules) * scale,
        scale,
        scale,
      );
    }
  }

  return canvas.toDataURL("image/png");
};

const getTargetSizePx = () => {
  const small = window.matchMedia("(max-width: 860px)").matches;
  return small ? 288 : 360;
};

const normalizeInput = (raw) => {
  const s = String(raw ?? "");
  if (s.trim().length === 0) return "";
  return s;
};

const updateCount = () => {
  const v = $payload.value ?? "";
  $count.textContent = String(v.length);
};

const render = async (reason) => {
  const token = ++lastToken;
  updateCount();

  const value = normalizeInput($payload.value);
  if (!value) {
    setState("等待输入内容");
    $hint.textContent = "输入后将自动生成，无需点击按钮";
    clearPreview();
    return;
  }

  const bytes = encoder.encode(value).length;
  if (bytes > 2400) {
    setState("内容过长，建议缩短后再试");
    $hint.textContent = `当前约 ${bytes} bytes（UTF-8）`;
    clearPreview();
    return;
  }

  setState(reason === "paste" ? "生成中…" : "生成中…");
  $hint.textContent = `当前约 ${bytes} bytes（UTF-8）`;

  await new Promise((r) => requestAnimationFrame(r));
  if (token !== lastToken) return;

  try {
    const url = makePngDataUrl(value, getTargetSizePx());
    if (token !== lastToken) return;
    setPreview(url);
    setState("右键保存图片（PNG）");
  } catch (e) {
    clearPreview();
    setState("生成失败：内容可能过长或包含不受支持的字符");
  }
};

const schedule = (reason, delayMs = debounceMs) => {
  if (timer) window.clearTimeout(timer);
  updateCount();

  const value = normalizeInput($payload.value);
  if (!value) {
    setState("等待输入内容");
    $hint.textContent = "输入后将自动生成，无需点击按钮";
  } else {
    const bytes = encoder.encode(value).length;
    if (bytes > 2400) {
      setState("内容过长，建议缩短后再试");
      $hint.textContent = `当前约 ${bytes} bytes（UTF-8）`;
    } else {
      setState(delayMs >= 800 ? "停止输入 1 秒后生成" : "生成中…");
      $hint.textContent = `当前约 ${bytes} bytes（UTF-8）`;
    }
  }

  timer = window.setTimeout(() => {
    timer = null;
    render(reason);
  }, delayMs);
};

$payload.addEventListener("input", () => schedule("input"));
$payload.addEventListener("paste", () => {
  schedule("paste", 80);
});

window.addEventListener("resize", () => {
  if ($img.getAttribute("src")) schedule("resize");
});

updateCount();
setTimeout(() => $payload.focus(), 0);
