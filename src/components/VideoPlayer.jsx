import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings2,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import Loading from './Loading'
import { useTvStore } from '../store/tvStore'

const normalizeStreamUrl = (url = '') => url.replace(/&amp;/g, '&')

const buildQualityOptions = (levels = []) => {
  const byHeight = new Map()
  levels.forEach((level, index) => {
    if (!level?.height) return
    const current = byHeight.get(level.height)
    if (!current || level.bitrate > current.bitrate) {
      byHeight.set(level.height, {
        height: level.height,
        bitrate: level.bitrate || 0,
        levelIndex: index,
      })
    }
  })

  return Array.from(byHeight.values()).sort((a, b) => a.height - b.height)
}

const findLevelIndexByHeight = (levels, height) => {
  const matches = levels
    .map((level, index) => ({ ...level, levelIndex: index }))
    .filter((level) => level.height === height)
    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))

  return matches[0]?.levelIndex ?? -1
}

export default function VideoPlayer({ channel, onNext, onPrevious }) {
  const videoRef = useRef(null)
  const shellRef = useRef(null)
  const hlsRef = useRef(null)
  const reconnectRef = useRef(0)
  const hideTimerRef = useRef(null)
  const settings = useTvStore((state) => state.settings)
  const updateSettings = useTvStore((state) => state.updateSettings)
  const selectedQualityRef = useRef(settings.streamQuality || 'auto')

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(settings.muted)
  const [volume, setVolume] = useState(settings.volume)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState('')
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [qualityOptions, setQualityOptions] = useState([])
  const [selectedQuality, setSelectedQuality] = useState(settings.streamQuality || 'auto')
  const [activeQuality, setActiveQuality] = useState('auto')

  const streamUrl = useMemo(() => normalizeStreamUrl(channel?.url), [channel?.url])

  const showControls = useCallback(() => {
    setControlsVisible(true)
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 3000)
  }, [])

  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    try {
      await video.play()
      setIsPlaying(true)
      setError('')
    } catch (playError) {
      setIsPlaying(false)
      if (playError?.name !== 'AbortError') {
        setError('Playback was blocked. Press play to start the live stream.')
      }
    }
  }, [])

  const reconnect = useCallback(() => {
    const video = videoRef.current
    if (!video || !streamUrl) return
    reconnectRef.current += 1
    setError('')
    setIsLoading(true)
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    setReloadKey((key) => key + 1)
  }, [streamUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !streamUrl) return undefined

    let mounted = true
    reconnectRef.current = 0
    setError('')
    setIsLoading(true)
    setIsBuffering(false)
    setIsPlaying(false)
    setQualityOptions([])
    setActiveQuality('auto')

    const onWaiting = () => setIsBuffering(true)
    const onPlaying = () => {
      setIsLoading(false)
      setIsBuffering(false)
      setIsPlaying(true)
    }
    const onPause = () => setIsPlaying(false)
    const onCanPlay = () => {
      setIsLoading(false)
      if (settings.autoplay) play()
    }
    const onError = () => {
      if (!mounted) return
      setError('This stream is temporarily unavailable.')
      setIsLoading(false)
    }

    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('pause', onPause)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('error', onError)

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveDurationInfinity: true,
        lowLatencyMode: true,
        enableWorker: true,
        backBufferLength: 60,
        manifestLoadingMaxRetry: 4,
        fragLoadingMaxRetry: 4,
      })
      hlsRef.current = hls
      hls.currentLevel = -1
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const options = buildQualityOptions(hls.levels)
        setQualityOptions(options)

        const preferredQuality = selectedQualityRef.current
        if (preferredQuality === 'auto') {
          hls.currentLevel = -1
        } else {
          const targetHeight = Number(preferredQuality)
          const levelIndex = findLevelIndexByHeight(hls.levels, targetHeight)
          if (levelIndex >= 0) {
            hls.currentLevel = levelIndex
          } else {
            selectedQualityRef.current = 'auto'
            setSelectedQuality('auto')
            updateSettings({ streamQuality: 'auto' })
            hls.currentLevel = -1
          }
        }

        setIsLoading(false)
        if (settings.autoplay) play()
      })
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const height = hls.levels[data.level]?.height
        setActiveQuality(height ? String(height) : 'auto')
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data?.fatal) return
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && reconnectRef.current < 3) {
          reconnectRef.current += 1
          setIsBuffering(true)
          window.setTimeout(() => hls.startLoad(), 900 * reconnectRef.current)
          return
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR && reconnectRef.current < 2) {
          reconnectRef.current += 1
          hls.recoverMediaError()
          return
        }
        setError('Live stream connection failed. Try reconnecting.')
        setIsLoading(false)
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl
    } else {
      setError('This browser cannot play HLS live streams.')
      setIsLoading(false)
    }

    return () => {
      mounted = false
      window.clearTimeout(hideTimerRef.current)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('error', onError)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      setQualityOptions([])
      video.removeAttribute('src')
      video.load()
    }
  }, [streamUrl, settings.autoplay, play, reloadKey, updateSettings])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = isMuted
    video.volume = volume
    updateSettings({ muted: isMuted, volume })
  }, [isMuted, volume, updateSettings])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    showControls()
    const onKeyDown = (event) => {
      const tagName = document.activeElement?.tagName?.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        onPrevious?.()
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        onNext?.()
      }
      if (event.key === ' ') {
        event.preventDefault()
        isPlaying ? videoRef.current?.pause() : play()
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        toggleFullscreen()
      }
      showControls()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isPlaying, onNext, onPrevious, play, showControls])

  const togglePlay = () => {
    showControls()
    if (isPlaying) {
      videoRef.current?.pause()
    } else {
      play()
    }
  }

  const toggleFullscreen = () => {
    const shell = shellRef.current
    if (!shell) return
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      shell.requestFullscreen?.()
    }
  }

  const onVolumeChange = (event) => {
    const nextVolume = Number(event.target.value)
    setVolume(nextVolume)
    setIsMuted(nextVolume === 0)
    showControls()
  }

  const onQualityChange = (event) => {
    const nextQuality = event.target.value
    const hls = hlsRef.current

    selectedQualityRef.current = nextQuality
    setSelectedQuality(nextQuality)
    updateSettings({ streamQuality: nextQuality })

    if (hls) {
      if (nextQuality === 'auto') {
        hls.currentLevel = -1
      } else {
        const levelIndex = findLevelIndexByHeight(hls.levels, Number(nextQuality))
        hls.currentLevel = levelIndex >= 0 ? levelIndex : -1
      }
    }

    showControls()
  }

  const visibleQualityOptions = qualityOptions.filter((quality) =>
    [240, 360, 480, 720, 1080].includes(quality.height),
  )
  const qualityChoices = visibleQualityOptions.length > 1 ? visibleQualityOptions : qualityOptions

  return (
    <section
      ref={shellRef}
      onMouseMove={showControls}
      onFocus={showControls}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        playsInline
        autoPlay={settings.autoplay}
        muted={isMuted}
        className="h-screen w-full bg-black object-contain"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/65" />

      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 grid place-items-center bg-black/35">
          <Loading label={isLoading ? 'Loading live stream' : 'Buffering'} />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 px-4">
          <div className="max-w-xl rounded-card border border-red-300/30 bg-red-950/35 p-6 text-center shadow-2xl backdrop-blur-2xl tv:max-w-3xl tv:p-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-300 tv:h-20 tv:w-20" />
            <p className="mt-4 text-xl font-black tv:text-4xl">{error}</p>
            <button
              type="button"
              onClick={reconnect}
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 font-bold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/70 tv:min-h-16 tv:px-8 tv:text-2xl"
            >
              <RotateCcw className="h-5 w-5 tv:h-8 tv:w-8" />
              Reconnect
            </button>
          </div>
        </div>
      )}

      <motion.div
        animate={{ opacity: controlsVisible ? 1 : 0, y: controlsVisible ? 0 : 18 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6 tv:p-10"
      >
        <div className="rounded-card border border-white/10 bg-black/45 p-4 shadow-2xl backdrop-blur-2xl tv:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <img
                src={channel.logo}
                alt={`${channel.name} logo`}
                className="h-14 w-14 rounded-2xl border border-white/10 bg-white/10 object-contain p-2 tv:h-24 tv:w-24"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-100 tv:text-base">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Live
                </div>
                <h1 className="truncate text-xl font-black sm:text-3xl tv:text-5xl">{channel.name}</h1>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/50 tv:text-xl">{channel.category}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button type="button" aria-label="Previous channel" onClick={onPrevious} className="player-button">
                <SkipBack />
              </button>
              <button type="button" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay} className="player-button primary">
                {isPlaying ? <Pause /> : <Play className="fill-current" />}
              </button>
              <button type="button" aria-label="Next channel" onClick={onNext} className="player-button">
                <SkipForward />
              </button>
              <button type="button" aria-label={isMuted ? 'Unmute' : 'Mute'} onClick={() => setIsMuted((value) => !value)} className="player-button">
                {isMuted || volume === 0 ? <VolumeX /> : volume > 0.55 ? <Volume2 /> : <Volume1 />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={onVolumeChange}
                className="h-12 w-28 accent-cyan-300 tv:w-48"
                aria-label="Volume"
              />
              {qualityChoices.length > 1 && (
                <label className="quality-select-wrap">
                  <Settings2 className="h-4 w-4 text-cyan-200 tv:h-7 tv:w-7" />
                  <span className="sr-only">HLS quality</span>
                  <select
                    value={selectedQuality}
                    onChange={onQualityChange}
                    onFocus={showControls}
                    aria-label={`Quality selector. Current stream quality ${selectedQuality === 'auto' ? `Auto${activeQuality !== 'auto' ? `, ${activeQuality}p active` : ''}` : `${selectedQuality}p`}`}
                    className="quality-select"
                  >
                    <option value="auto">Auto{activeQuality !== 'auto' ? ` (${activeQuality}p)` : ''}</option>
                    {qualityChoices.map((quality) => (
                      <option key={quality.height} value={quality.height}>
                        {quality.height}p
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <FavoriteButton channel={channel} />
              <button type="button" aria-label="Fullscreen" onClick={toggleFullscreen} className="player-button">
                {isFullscreen ? <Minimize /> : <Maximize />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
