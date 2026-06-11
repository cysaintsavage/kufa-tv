import { Link, useLocation } from 'react-router-dom'
import { Bell, MonitorPlay, Search, Settings, UserRound } from 'lucide-react'
import channelData from '../lib/channelData'

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#06070d]/72 backdrop-blur-2xl lg:left-24 xl:left-28">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8 tv:h-24">
        <Link to="/" data-focusable="true" className="flex items-center gap-3 rounded-full focus:outline-none focus:ring-4 focus:ring-cyan-300/60">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-rose-500 shadow-lg shadow-cyan-500/20 tv:h-16 tv:w-16">
            <MonitorPlay className="h-6 w-6 text-white tv:h-9 tv:w-9" />
          </span>
          <span>
            <span className="block text-lg font-black leading-none tracking-wide tv:text-3xl">Kufa TV</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-white/45 sm:block tv:text-sm">{channelData.length} live channels</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="truncate rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/55 tv:text-lg">
            {location.pathname === '/' ? 'Home' : decodeURIComponent(location.pathname.split('/').filter(Boolean).join(' / '))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            data-focusable="true"
            aria-label="Search"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-white/75 transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:h-16 tv:w-16"
          >
            <Search className="h-5 w-5 tv:h-8 tv:w-8" />
          </Link>
          <button
            type="button"
            data-focusable="true"
            aria-label="Notifications"
            className="hidden h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-white/75 transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-cyan-300/60 sm:grid tv:h-16 tv:w-16"
          >
            <Bell className="h-5 w-5 tv:h-8 tv:w-8" />
          </button>
          <Link
            to="/developer"
            data-focusable="true"
            aria-label="Developer profile"
            className="hidden h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-white/75 transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-cyan-300/60 sm:grid tv:h-16 tv:w-16"
          >
            <UserRound className="h-5 w-5 tv:h-8 tv:w-8" />
          </Link>
          <Link
            to="/settings"
            data-focusable="true"
            aria-label="Settings"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-white/75 transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:h-16 tv:w-16"
          >
            <Settings className="h-5 w-5 tv:h-8 tv:w-8" />
          </Link>
        </div>
      </div>
    </header>
  )
}
