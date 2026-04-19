import { Outlet } from 'react-router-dom'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export default function Layout() {
  useScrollToTop()

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

