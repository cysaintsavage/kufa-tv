import { BrowserRouter, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import AppRoutes from './app/routes'
import useKeyboardNavigation from './hooks/useKeyboardNavigation'

function Layout() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/live/')
  useKeyboardNavigation({ enabled: !isPlayer })

  return (
    <div className="min-h-screen bg-[#07080f] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_-10%,rgba(139,92,246,0.22),transparent_40%),radial-gradient(ellipse_at_80%_80%,rgba(217,70,239,0.14),transparent_40%),radial-gradient(ellipse_at_50%_50%,rgba(99,102,241,0.08),transparent_60%),linear-gradient(160deg,#07080f_0%,#0d0b1e_50%,#070d14_100%)]" />
      {!isPlayer && <Sidebar />}
      {!isPlayer && <Navbar />}
      <main className={isPlayer ? 'min-h-screen' : 'min-h-screen px-4 pb-20 pt-16 sm:px-6 lg:pl-32 lg:pr-8 lg:pt-20 xl:pl-36'}>
        <AppRoutes />
      </main>
      {!isPlayer && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
