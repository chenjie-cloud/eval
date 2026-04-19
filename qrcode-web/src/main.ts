import './style.css'
import QRCode, { type QRCodeErrorCorrectionLevel } from 'qrcode'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Missing #app')

app.innerHTML = `
  <div class="shell">
    <header class="top">
      <div class="brand">QR</div>
      <div class="meta">
        <div class="title">极简二维码生成</div>
        <div class="subtitle">本地生成，不上传；粘贴即出图。</div>
      </div>
    </header>
    <main class="main">
      <section class="panel">
        <label class="label" for="input">内容</label>
        <textarea
          id="input"
          class="input"
          rows="8"
          placeholder="粘贴你的网址或文本链接"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        ></textarea>
        <div class="hint" id="hint">停止输入约 1 秒后自动生成</div>
      </section>
      <section class="preview" aria-live="polite">
        <div class="frame" id="frame">
          <div class="empty" id="empty">
            <div class="emptyTitle">二维码预览</div>
            <div class="emptySub">输入任意网址或文本</div>
          </div>
          <img class="qr" id="qr" alt="二维码" draggable="false" />
        </div>
        <div class="status" id="status"></div>
      </section>
    </main>
  </div>
`

const input = app.querySelector<HTMLTextAreaElement>('#input')
const img = app.querySelector<HTMLImageElement>('#qr')
const empty = app.querySelector<HTMLDivElement>('#empty')
const status = app.querySelector<HTMLDivElement>('#status')
const hint = app.querySelector<HTMLDivElement>('#hint')

if (!input || !img || !empty || !status || !hint) throw new Error('Missing UI nodes')

type UiState = 'idle' | 'generating' | 'ready' | 'error'
const setState = (s: UiState, message = '') => {
  status.textContent = message
  status.dataset.state = s
}

const pickWidth = (len: number) => {
  if (len > 220) return 640
  if (len > 140) return 512
  if (len > 80) return 384
  return 320
}

const pickEcl = (len: number): QRCodeErrorCorrectionLevel => {
  if (len <= 40) return 'Q'
  if (len <= 120) return 'M'
  return 'M'
}

const debounce = <T extends (...args: any[]) => void>(fn: T, waitMs: number) => {
  let t: number | undefined
  return (...args: Parameters<T>) => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), waitMs)
  }
}

let lastJob = 0

const generate = async (raw: string) => {
  const text = raw.trim()

  if (!text) {
    img.removeAttribute('src')
    img.classList.remove('isReady')
    empty.classList.remove('isHidden')
    setState('idle', '')
    hint.textContent = '停止输入约 1 秒后自动生成'
    return
  }

  const job = ++lastJob
  setState('generating', '生成中…')
  hint.textContent = `长度：${text.length}`

  try {
    const width = pickWidth(text.length)
    const ecl = pickEcl(text.length)
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: ecl,
      margin: 3,
      width,
      type: 'image/png',
      color: { dark: '#111111', light: '#ffffff' },
    })

    if (job !== lastJob) return

    img.src = dataUrl
    img.classList.add('isReady')
    empty.classList.add('isHidden')
    setState('ready', '右键保存图片（PNG）')
  } catch {
    if (job !== lastJob) return
    img.removeAttribute('src')
    img.classList.remove('isReady')
    empty.classList.remove('isHidden')
    setState('error', '生成失败，请尝试缩短内容或重试')
  }
}

const scheduleGenerate = debounce((v: string) => {
  void generate(v)
}, 1000)

input.addEventListener('input', (e) => {
  const v = (e.currentTarget as HTMLTextAreaElement).value
  scheduleGenerate(v)
})

setState('idle', '')
