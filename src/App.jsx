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
    <div className="min-h-screen bg-[#06070d] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(245,64,117,0.18),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.14),transparent_26%),linear-gradient(135deg,#06070d_0%,#111827_46%,#08111f_100%)]" />
      {!isPlayer && <Sidebar />}
      {!isPlayer && <Navbar />}
      <main className={isPlayer ? 'min-h-screen' : 'min-h-screen px-4 pb-24 pt-20 sm:px-6 lg:pl-32 lg:pr-8 lg:pt-24 xl:pl-36'}>
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
