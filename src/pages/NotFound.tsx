import { Link } from 'react-router-dom'
import Empty from '@/components/Empty'

export default function NotFound() {
  return (
    <div className="py-16">
      <Empty
        title="页面不存在"
        description="你访问的链接可能已失效。"
        action={
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm text-white transition-opacity hover:opacity-90 dark:text-black"
          >
            返回首页
          </Link>
        }
      />
    </div>
  )
}

