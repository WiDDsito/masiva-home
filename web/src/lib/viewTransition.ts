import { flushSync } from 'react-dom'

let current: ViewTransition | undefined
/** Native shared-element snapshots, with an immediate accessible fallback. */
export function transitionView(update: () => void) {
  current?.skipTransition()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !document.startViewTransition) {
    flushSync(update)
    return Promise.resolve()
  }
  current = document.startViewTransition(() => flushSync(update))
  const transition = current
  document.documentElement.dataset.viewTransition = 'active'
  void transition.finished.catch(() => undefined).then(() => {
    if (current === transition) document.documentElement.removeAttribute('data-view-transition')
  })
  return current.updateCallbackDone.catch(() => undefined)
}
