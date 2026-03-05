import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/Button'
import { cn } from '@/lib/utils'

export type CarouselSlide = {
  image: string
  title: string
  description: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}

export default function Carousel({
  slides,
  className,
  intervalMs = 5200,
}: {
  slides: CarouselSlide[]
  className?: string
  intervalMs?: number
}) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides])
  const [index, setIndex] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const dragRef = useRef<{ x: number; i: number } | null>(null)

  useEffect(() => {
    if (safeSlides.length <= 1 || isHolding) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % safeSlides.length)
    }, intervalMs)
    return () => window.clearInterval(t)
  }, [safeSlides.length, intervalMs, isHolding])

  const canRender = safeSlides.length > 0
  const slide = canRender ? safeSlides[index] : null

  function prev() {
    setIndex((i) => (i - 1 + safeSlides.length) % safeSlides.length)
  }

  function next() {
    setIndex((i) => (i + 1) % safeSlides.length)
  }

  if (!slide) return null

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[calc(var(--radius)+6px)] border border-[var(--line)] bg-black/5 shadow-[var(--shadow)]',
        className,
      )}
      onMouseEnter={() => setIsHolding(true)}
      onMouseLeave={() => setIsHolding(false)}
      onPointerDown={(e) => {
        setIsHolding(true)
        dragRef.current = { x: e.clientX, i: index }
      }}
      onPointerMove={(e) => {
        if (!dragRef.current) return
        const delta = e.clientX - dragRef.current.x
        if (Math.abs(delta) < 42) return
        if (delta > 0) prev()
        else next()
        dragRef.current = null
      }}
      onPointerUp={() => {
        setIsHolding(false)
        dragRef.current = null
      }}
      onPointerCancel={() => {
        setIsHolding(false)
        dragRef.current = null
      }}
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/7]">
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/12 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,203,181,0.22),transparent_50%)]" />

        <div
          className={cn(
            'absolute inset-x-0 bottom-0 px-5 pb-6 pt-16 sm:px-7 sm:pb-7',
            slide.align === 'center' ? 'text-center' : 'text-left',
          )}
        >
          <div className="mx-auto max-w-2xl">
            <div className="font-[var(--font-display)] text-[28px] leading-[1.12] tracking-[0.03em] text-white sm:text-[36px]">
              {slide.title}
            </div>
            <div className="mt-3 text-sm text-white/80 sm:text-[15px]">{slide.description}</div>
          </div>
        </div>

        <div className="absolute right-4 top-4 hidden gap-2 sm:flex">
          <Button variant="outline" size="sm" aria-label="上一张" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" aria-label="下一张" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="text-xs text-[var(--muted)]">
          {String(index + 1).padStart(2, '0')} / {String(safeSlides.length).padStart(2, '0')}
        </div>
        <div className="flex items-center gap-2">
          {safeSlides.map((_, i) => (
            <button
              key={i}
              aria-label={`跳转到第 ${i + 1} 张`}
              className={cn(
                'h-1.5 w-10 rounded-full transition-colors',
                i === index ? 'bg-[var(--accent)]' : 'bg-black/15 dark:bg-white/15',
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

