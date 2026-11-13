import { flushSync } from 'react-dom'

let current: ViewTransition | undefined
/** Page snapshots, with a short entry animation when the native API is absent. */
export function transitionView(update: () => void, afterUpdate?: () => void) {
  current?.skipTransition()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const commit = () => { flushSync(update); afterUpdate?.() }
  if (reduced || !document.startViewTransition) {
    commit()
    if (!reduced) document.querySelector('.page-view')?.animate([
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'none' },
    ], { duration: 280, easing: 'ease-out' })
    return Promise.resolve()
  }
  current = document.startViewTransition(commit)
  const transition = current
  document.documentElement.dataset.viewTransition = 'active'
  void transition.finished.catch(() => undefined).then(() => {
    if (current === transition) document.documentElement.removeAttribute('data-view-transition')
  })
  return current.updateCallbackDone.catch(() => undefined)
}
