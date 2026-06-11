import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Grid3X3, Search } from 'lucide-react'
import channelData from '../lib/channelData'
import ChannelGrid from '../components/ChannelGrid'
import CategoryFilter from '../components/CategoryFilter'
import Seo from '../components/Seo'

export default function Category() {
  const { name = '' } = useParams()
  const category = decodeURIComponent(name)
  const channels = useMemo(
    () => channelData.filter((channel) => channel.category?.toLowerCase() === category.toLowerCase()),
    [category],
  )

  return (
    <div className="space-y-6 tv:space-y-10">
      <Seo
        title={`${category} Channels`}
        description={`Watch ${channels.length} ${category} live IPTV channels on Kufa TV.`}
      />
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 tv:text-base">
              <Grid3X3 className="h-4 w-4 tv:h-6 tv:w-6" />
              Category
            </div>
            <h1 className="text-3xl font-black sm:text-5xl tv:text-7xl">{category}</h1>
            <p className="mt-2 text-white/55 tv:text-2xl">{channels.length} live channels</p>
          </div>
          <Link to="/search" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-5 font-bold text-white/75 transition hover:bg-white/[0.12] focus:outline-none focus:ring-4 focus:ring-cyan-300/60 tv:min-h-20 tv:px-8 tv:text-2xl">
            <Search className="h-5 w-5 tv:h-8 tv:w-8" />
            Search
          </Link>
        </div>
        <CategoryFilter active={category} />
      </header>

      <ChannelGrid
        channels={channels}
        emptyTitle="Category not found"
        emptyText="Choose another category from the filter bar."
      />
    </div>
  )
}
