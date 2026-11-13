import { flushSync } from 'react-dom'

let current: ViewTransition | undefined
let fallback: Animation | undefined
let revision = 0

async function prepareCataloguePhotos() {
  const photos = Array.from(document.querySelectorAll<HTMLImageElement>('.catalog-card img'))
    .filter(photo => photo.getBoundingClientRect().top < window.innerHeight).slice(0, 4)
  let timeout: ReturnType<typeof setTimeout> | undefined
  await Promise.race([
    Promise.allSettled(photos.map(photo => { photo.loading = 'eager'; return photo.decode() })),
    new Promise<void>(resolve => { timeout = setTimeout(resolve, 180) }),
  ])
  clearTimeout(timeout)
}

/** Capture the showroom as a viewport, so its long page never morphs into the catalogue. */
export function transitionView(update: () => void, afterUpdate?: () => void, variant: 'page' | 'showroom-catalog' = 'page') {
  const request = ++revision
  current?.skipTransition()
  fallback?.cancel()
  fallback = undefined
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const commit = () => { flushSync(update); afterUpdate?.() }
  if (reduced) { commit(); return Promise.resolve() }
  if (!document.startViewTransition) {
    const content = document.querySelector('.page-view')
    if (variant === 'showroom-catalog' && content) {
      const destination = window.location.href
      const exit = content.animate([{ opacity: getComputedStyle(content).opacity }, { opacity: 0 }], { duration: 160, easing: 'ease-out', fill: 'forwards' })
      fallback = exit
      return exit.finished.catch(() => undefined).then(async () => {
        if (request !== revision || window.location.href !== destination) { exit.cancel(); return }
        commit()
        await prepareCataloguePhotos()
        if (request !== revision || window.location.href !== destination) { exit.cancel(); return }
        exit.cancel()
        fallback = content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' })
      })
    }
    commit()
    fallback = content?.animate([
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'none' },
    ], { duration: 280, easing: 'ease-out' })
    return Promise.resolve()
  }
  document.documentElement.dataset.pageTransition = variant
  current = document.startViewTransition(async () => {
    commit()
    if (variant === 'showroom-catalog') await prepareCataloguePhotos()
  })
  const transition = current
  document.documentElement.dataset.viewTransition = 'active'
  void transition.finished.catch(() => undefined).then(() => {
    if (current === transition) {
      document.documentElement.removeAttribute('data-view-transition')
      document.documentElement.removeAttribute('data-page-transition')
    }
  })
  return current.updateCallbackDone.catch(() => undefined)
}
