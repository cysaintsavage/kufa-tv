import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, autoFocus = false, placeholder = 'Search live channels' }) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45 tv:h-7 tv:w-7" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="h-14 w-full rounded-card border border-white/10 bg-white/[0.08] pl-12 pr-12 text-base font-semibold text-white outline-none backdrop-blur-2xl transition placeholder:text-white/35 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/25 tv:h-20 tv:pl-16 tv:text-2xl"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-300/50 tv:h-12 tv:w-12"
        >
          <X className="h-5 w-5 tv:h-7 tv:w-7" />
        </button>
      )}
    </div>
  )
}
