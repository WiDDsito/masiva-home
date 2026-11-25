import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'mh-theme'

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Tema claro/oscuro.
 *
 * - Sin elección guardada, sigue la preferencia del sistema y reacciona a sus
 *   cambios en vivo.
 * - Al pulsar el botón, la elección se guarda y deja de seguir al sistema.
 * - El atributo `data-theme` en <html> es lo que leen los tokens CSS.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStored() ?? systemTheme())
  const [manual, setManual] = useState<boolean>(() => readStored() !== null)

  useEffect(() => {
    if (manual) return

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [manual])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setManual(true)
    document.documentElement.dataset.theme = next

    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Navegación privada o almacenamiento bloqueado: el cambio dura la sesión.
    }
  }

  return { theme, toggle }
}
