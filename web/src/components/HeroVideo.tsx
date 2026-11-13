import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import videoSource from '../../assets/videos/modern-template.mp4'
import { images } from '../content/images'

export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const element = video.current
    if (!element) return
    element.muted = true
    element.defaultMuted = true
    element.volume = 0
    const silence = () => { if (!element.muted) element.muted = true; if (element.volume !== 0) element.volume = 0 }
    let visible = true
    const sync = () => {
      silence()
      if (!visible || document.hidden || paused || reduced) element.pause()
      else void element.play().catch(() => undefined)
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(element)
    element.addEventListener('volumechange', silence)
    element.addEventListener('loadeddata', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => { observer.disconnect(); element.pause(); element.removeEventListener('volumechange', silence); element.removeEventListener('loadeddata', sync); document.removeEventListener('visibilitychange', sync) }
  }, [paused, reduced])
  return <>
    <video ref={video} className="hero__media hero__video" src={reduced ? undefined : videoSource} poster={images.escanor} autoPlay={!reduced} muted loop playsInline preload={reduced ? 'none' : 'metadata'} aria-hidden="true" tabIndex={-1} disablePictureInPicture disableRemotePlayback />
    {!reduced && <button type="button" className="hero__video-control" aria-label={paused ? 'Reproducir video de portada' : 'Pausar video de portada'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Reproducir video' : 'Pausar video'}</button>}
  </>
}
