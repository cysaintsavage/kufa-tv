import { motion } from 'framer-motion'
import { RadioTower } from 'lucide-react'

export default function Loading({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[50vh] place-items-center px-6 text-center">
      <div className="flex flex-col items-center gap-5">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="grid h-20 w-20 place-items-center rounded-2xl border border-white/15 bg-white/10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
        >
          <RadioTower className="h-9 w-9 text-cyan-300" />
        </motion.div>
        <div>
          <p className="text-lg font-semibold text-white">{label}</p>
          <p className="mt-1 text-sm text-white/55">Preparing your live stream</p>
        </div>
      </div>
    </div>
  )
}
