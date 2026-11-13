import { useEffect } from 'react'

/** Motion owns its initial states only after loading; native content remains the fallback. */
export function useScrollAnimations(catalogView = false) {
  useEffect(() => {
    let cancelled = false
    let dispose: (() => void) | undefined
    void (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
          import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
        ])
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const media = gsap.matchMedia()
        media.add('(prefers-reduced-motion: no-preference)', () => {
          const lenis = new Lenis({ smoothWheel: true, duration: .85, anchors: { offset: -72 } })
          lenis.on('scroll', ScrollTrigger.update)
          const raf = (time: number) => lenis.raf(time * 1000)
          gsap.ticker.add(raf)
          if (!catalogView) {
            gsap.fromTo('.hero__media', { clipPath: 'inset(12% 5% 12% 5%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut' })
            gsap.fromTo('.hero .split-word__inner', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .065, delay: .25, ease: 'power3.out' })
            gsap.from('.hero__lead, .hero__actions', { opacity: 0, y: 12, duration: .65, stagger: .12, delay: .6 })
            gsap.fromTo('.hero__media', { scale: 1, yPercent: 0 }, { scale: 1.12, yPercent: 9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 } })
            gsap.to('.hero__inner', { y: -65, opacity: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 } })
          }
          gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
            gsap.fromTo(element, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .65, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 95%', once: true } })
          })
          gsap.utils.toArray<HTMLElement>('main h1, main h2').forEach(heading => {
            if (heading.closest('.hero')) return
            const words = heading.querySelectorAll('.split-word__inner')
            if (words.length) gsap.fromTo(words, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .65, stagger: .045, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 95%', once: true } })
          })
          gsap.utils.toArray<HTMLElement>('.category .photo').forEach(photo => {
            gsap.fromTo(photo, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'power3.inOut', scrollTrigger: { trigger: photo, start: 'top 95%', once: true } })
          })
          if (!catalogView) {
            gsap.fromTo('.showroom__stage', { opacity: .65, scale: .97 }, { opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: '.showroom__stage', start: 'top bottom', end: 'top 35%', scrub: .4 } })
            gsap.to('.showroom__stage', { opacity: .7, y: -24, ease: 'none', scrollTrigger: { trigger: '.showroom', start: 'bottom 35%', end: 'bottom top', scrub: .4 } })
          }
          return () => { gsap.ticker.remove(raf); lenis.destroy() }
        })
        dispose = () => media.revert()
        void document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh() })
      } catch { /* Native scrolling and visible content remain available. */ }
    })()
    return () => { cancelled = true; dispose?.() }
  }, [catalogView])
}
