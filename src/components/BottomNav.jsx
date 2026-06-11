import { NavLink } from 'react-router-dom'
import { Heart, Home, Search, Settings, UserRound } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/favorites', label: 'Saved', icon: Heart },
  { to: '/developer', label: 'Dev', icon: UserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#06070d]/88 px-2 py-2 backdrop-blur-2xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => [
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold transition focus:outline-none focus:ring-4 focus:ring-cyan-300/60',
                isActive ? 'bg-cyan-300 text-slate-950' : 'text-white/60 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
