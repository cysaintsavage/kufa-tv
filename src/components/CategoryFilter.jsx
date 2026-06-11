import { NavLink } from 'react-router-dom'
import channelData from '../lib/channelData'

const categories = Array.from(new Set(channelData.map((channel) => channel.category).filter(Boolean)))

export default function CategoryFilter({ active = 'All', compact = false }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      <NavLink
        to="/"
        data-focusable="true"
        className={({ isActive }) => [
          'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:px-7 tv:py-4 tv:text-xl',
          (isActive && active === 'All') || active === 'All'
            ? 'border-cyan-200/70 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/20'
            : 'border-white/10 bg-white/[0.07] text-white/70 hover:bg-white/[0.12]',
          compact ? 'tv:text-lg' : '',
        ].join(' ')}
      >
        All
      </NavLink>
      {categories.map((category) => (
        <NavLink
          key={category}
          to={`/category/${encodeURIComponent(category)}`}
          data-focusable="true"
          className={({ isActive }) => [
            'shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:px-7 tv:py-4 tv:text-xl',
            isActive || active === category
              ? 'border-cyan-200/70 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/20'
              : 'border-white/10 bg-white/[0.07] text-white/70 hover:bg-white/[0.12]',
          ].join(' ')}
        >
          {category}
        </NavLink>
      ))}
    </div>
  )
}
