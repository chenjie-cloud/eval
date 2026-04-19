const el = (id) => document.getElementById(id)

const payload = el("payload")
const clearBtn = el("clearBtn")
const status = el("status")
const qrImage = el("qrImage")
const emptyState = el("emptyState")
const qrFrame = el("qrFrame")

const debounce = (fn, waitMs) => {
  let t = null
  return (...args) => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), waitMs)
  }
}

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

const computeSizes = () => {
  const frame = qrFrame.getBoundingClientRect()
  const usable = Math.max(220, Math.floor(frame.width - 28))
  const displayPx = clamp(Math.min(320, usable), 220, 360)
  const pngPx = clamp(Math.round(displayPx * 2), 320, 1024)
  return { displayPx, pngPx }
}

let lastText = ""
let lastPngPx = 0
let inFlight = 0

const setEmpty = () => {
  qrImage.style.display = "none"
  qrImage.removeAttribute("src")
  emptyState.style.display = "block"
  status.textContent = ""
}

const setError = (msg) => {
  qrImage.style.display = "none"
  emptyState.style.display = "block"
  emptyState.textContent = msg
  status.textContent = ""
}

const setBusy = (msg) => {
  status.textContent = msg
}

const setReady = (msg) => {
  status.textContent = msg
}

const normalizeText = (s) => (s ?? "").toString().trim()

const generateNow = async () => {
  const text = normalizeText(payload.value)
  if (!text) {
    emptyState.textContent = "输入内容后将自动生成二维码"
    setEmpty()
    lastText = ""
    lastPngPx = 0
    return
  }

  if (!window.QRCode || typeof window.QRCode.toDataURL !== "function") {
    setError("二维码引擎加载失败，请检查网络后刷新")
    return
  }

  const { displayPx, pngPx } = computeSizes()
  qrImage.style.width = `${displayPx}px`

  if (text === lastText && pngPx === lastPngPx) return
  lastText = text
  lastPngPx = pngPx

  const seq = ++inFlight
  setBusy("生成中…")

  const errorCorrectionLevel = text.length < 60 ? "Q" : "M"
  const opts = {
    errorCorrectionLevel,
    margin: 4,
    width: pngPx,
    color: { dark: "#12110f", light: "#ffffff" },
  }

  try {
    const url = await window.QRCode.toDataURL(text, opts)
    if (seq !== inFlight) return
    qrImage.src = url
    qrImage.style.display = "block"
    emptyState.style.display = "none"
    if (text.length > 1500) {
      setReady("内容较长，可能影响扫码")
    } else {
      setReady("已生成")
    }
  } catch {
    if (seq !== inFlight) return
    setError("生成失败：请尝试缩短内容")
  }
}

const generateDebounced = debounce(generateNow, 1000)

payload.addEventListener("input", () => {
  emptyState.textContent = "输入内容后将自动生成二维码"
  generateDebounced()
})

clearBtn.addEventListener("click", () => {
  payload.value = ""
  payload.focus()
  inFlight++
  setEmpty()
})

const ro = new ResizeObserver(() => {
  if (normalizeText(payload.value)) generateDebounced()
})
ro.observe(qrFrame)

window.addEventListener("load", () => {
  payload.focus()
  setEmpty()
})

