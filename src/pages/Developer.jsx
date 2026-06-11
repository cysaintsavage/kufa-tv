import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BadgeCheck,
  Code2,
  Globe2,
  Layers3,
  MonitorSmartphone,
  Palette,
  Sparkles,
  Workflow,
} from 'lucide-react'
import Seo from '../components/Seo'

const profileUrl = 'https://sudipmhx.pro.bd/'

const skills = [
  'Tailwind CSS',
  'JavaScript',
  'TypeScript',
  'React.js',
  'Next.js',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Firebase Auth',
  'Figma',
  'Git',
  'WordPress',
]

const strengths = [
  {
    title: 'Development',
    description: 'Responsive web apps built for strong performance across device sizes.',
    icon: MonitorSmartphone,
  },
  {
    title: 'UI/UX Design',
    description: 'Modern, user-centered interfaces that make products easier to understand and use.',
    icon: Palette,
  },
  {
    title: 'WordPress',
    description: 'Custom, manageable WordPress websites for fast content publishing.',
    icon: Workflow,
  },
]


export default function Developer() {
  return (
    <div className="space-y-8 tv:space-y-12">
      <Seo
        title="Developer Profile"
        description="Meet MahaTab Hossen Sudip, a front-end-focused Full Stack MERN Developer and WordPress specialist."
        url="https://sudipmhx.pro.bd/"
        image="/sudipmhx.png"
      />
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8 tv:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(34,211,238,0.20),transparent_30%),linear-gradient(135deg,rgba(244,63,94,0.16),transparent_50%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center tv:grid-cols-[1fr_34rem]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 tv:text-base">
              <Sparkles className="h-4 w-4 tv:h-6 tv:w-6" />
              Developer Profile
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl tv:text-8xl">
              MahaTab Hossen Sudip
            </h1>
            <p className="mt-4 max-w-3xl text-lg font-bold text-cyan-100 sm:text-2xl tv:text-4xl">
              Front-End-focused Full Stack MERN Developer
            </p>
            <p className="mt-4 max-w-3xl text-base font-medium text-white/62 sm:text-lg tv:text-3xl">
              MERN stack and WordPress specialist crafting purposeful, responsive, and impactful digital experiences.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-6 text-base font-black text-slate-950 shadow-xl shadow-white/10 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/70 tv:min-h-20 tv:px-10 tv:text-3xl"
              >
                <Globe2 className="h-5 w-5 tv:h-9 tv:w-9" />
                Visit Website
                <ArrowUpRight className="h-5 w-5 tv:h-9 tv:w-9" />
              </a>
              <a
                href={`${profileUrl}/projects`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/10 bg-white/8 px-6 text-base font-black text-white transition hover:bg-white/[0.14] focus:outline-none focus:ring-4 focus:ring-cyan-300/70 tv:min-h-20 tv:px-10 tv:text-3xl"
              >
                <Layers3 className="h-5 w-5 tv:h-9 tv:w-9" />
                View Projects
              </a>
            </div>
          </div>

          <div
            style={{
              backgroundImage: `url('/sudipmhx.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            className="
              aspect-356/491
              w-full
              flex flex-col justify-end
              rounded-3xl
              border border-white/10
              bg-black/25
              p-5
              text-center
              shadow-inner shadow-white/5
              tv:p-8
            "
          >
              {/* <div className="mx-auto grid h-28 w-28 place-items-center rounded-[2rem] bg-gradient-to-br from-cyan-300 to-rose-500 shadow-2xl shadow-cyan-500/20 tv:h-44 tv:w-44"> */}
              {/* <UserRound className="h-14 w-14 text-white tv:h-24 tv:w-24" /> */}
              {/* <img src="/sudipmhx.jpg" alt="MahaTab Hossen Sudip" /> */}
            {/* </div> */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100 tv:text-2xl">
              <BadgeCheck className="h-5 w-5 tv:h-8 tv:w-8" />
              Available for work
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/45 tv:text-xl">
              4+ years experience
            </p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-3 tv:gap-7">
        {strengths.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: index * 0.04 }}
              className="rounded-card border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl tv:p-8"
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300 text-slate-950 tv:h-20 tv:w-20">
                <Icon className="h-6 w-6 tv:h-11 tv:w-11" />
              </div>
              <h2 className="text-xl font-black tv:text-4xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/58 tv:text-2xl tv:leading-9">{item.description}</p>
            </motion.article>
          )
        })}
      </section>

      <section className="rounded-card border border-white/10 bg-white/6 p-5 backdrop-blur-2xl tv:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200 tv:h-16 tv:w-16">
            <Code2 className="h-6 w-6 tv:h-9 tv:w-9" />
          </span>
          <h2 className="text-2xl font-black tv:text-5xl">Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2 tv:gap-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-black/22 px-4 py-2 text-sm font-bold text-white/75 tv:px-7 tv:py-4 tv:text-2xl"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
