import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useCart } from '../lib/CartContext'
import { MegaMenu } from '../components/MegaMenu'
import { useScrolled } from '../lib/useScrolled'
import { useTheme } from '../lib/useTheme'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" strokeLinecap="round" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease)' }}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
      ) : (
        <path d="M4 8h16M4 16h16" strokeLinecap="round" />
      )}
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8.2 8.2 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

const plainLinks = [
  { href: '#showroom', label: 'Showroom' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#contacto', label: 'Contacto' },
]

const mobileLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#tienda', label: 'Tienda' },
  { href: '#showroom', label: 'Showroom' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#contacto', label: 'Contacto' },
]

export function Header({ onCatalogNavigate }: { onCatalogNavigate: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const navigating = useRef(false)
  const suppressHover = useRef(false)
  const { count, open: cartOpen, setOpen: setCartOpen } = useCart()
  const [megaMode, setMegaMode] = useState<'closed' | 'hover' | 'pinned'>('closed')
  const megaOpen = megaMode !== 'closed'
  const megaRoot = useRef<HTMLDivElement>(null)
  const megaTrigger = useRef<HTMLButtonElement>(null)
  const mobileTrigger = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()
  const cancelClose = () => clearTimeout(closeTimer.current)
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => {
      setMegaMode(current => current === 'hover' ? 'closed' : current)
    }, 180)
  }
  useEffect(() => () => clearTimeout(closeTimer.current), [])
  const { theme, toggle } = useTheme()
  const scrolled = useScrolled()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); mobileTrigger.current?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!megaOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { cancelClose(); setMegaMode('closed'); megaTrigger.current?.focus() }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!megaRoot.current?.contains(event.target as Node)) { cancelClose(); setMegaMode('closed') }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => { document.removeEventListener('keydown', onKeyDown); document.removeEventListener('pointerdown', onPointerDown) }
  }, [megaOpen])

  const goCatalog = async (id: string) => {
    if (navigating.current) return
    navigating.current = true
    suppressHover.current = true
    cancelClose()
    flushSync(() => { setLeaving(true); setMegaMode('closed') })
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const panels = document.querySelectorAll('#mega-tienda, #menu-movil')
      const animations = Array.from(panels).flatMap(panel => panel.getAnimations())
      await Promise.allSettled(animations.map(animation => animation.finished))
    }
    flushSync(() => { setOpen(false); setLeaving(false) })
    if (window.matchMedia('(max-width: 900px)').matches) mobileTrigger.current?.focus({ preventScroll: true })
    else megaTrigger.current?.focus({ preventScroll: true })
    onCatalogNavigate(id)
    navigating.current = false
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${leaving ? 'is-navigating' : ''}`.trim()}>
      <div className="container header__inner">
        <a className="brand" href="#inicio" aria-label="Masiva Home, ir al inicio">
          Masiva Home
        </a>

        <nav className="nav" aria-label="Navegación principal">
          <a className="nav__link" href="#inicio">
            Inicio
          </a>

          <div
            className={`nav__item nav__item--mega ${megaOpen ? 'is-open' : ''}`.trim()}
            ref={megaRoot}
            onPointerEnter={event => { if (event.pointerType === 'mouse' && !navigating.current && !suppressHover.current) { cancelClose(); setMegaMode(current => current === 'closed' ? 'hover' : current) } }}
            onPointerLeave={() => { suppressHover.current = false; scheduleClose() }}
            onKeyDown={event => { if (event.key === 'Tab' && megaOpen) setMegaMode('pinned') }}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) { cancelClose(); setMegaMode('closed') } }}
          >
            <button
              type="button"
              ref={megaTrigger}
              className="nav__link nav__trigger"
              aria-expanded={megaOpen}
              aria-controls="mega-tienda"
              onClick={() => { if (navigating.current) return; suppressHover.current = false; cancelClose(); setMegaMode(current => current === 'pinned' ? 'closed' : 'pinned') }}
              onKeyDown={event => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault(); suppressHover.current = false; cancelClose(); setMegaMode('pinned')
                  requestAnimationFrame(() => megaRoot.current?.querySelector<HTMLButtonElement>('.mega__all')?.focus())
                }
              }}
            >
              Tienda
              <ChevronIcon open={megaOpen} />
            </button>
            <MegaMenu onSelect={goCatalog} />
          </div>

          {plainLinks.map((item) => (
            <a key={item.href} className="nav__link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <button
            className="icon-btn"
            type="button"
            onClick={toggle}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="icon-btn" type="button" aria-label="Buscar productos">
            <SearchIcon />
          </button>
          <button className="icon-btn" type="button" aria-label={`Carrito, ${count} productos`} aria-haspopup="dialog" aria-expanded={cartOpen} aria-controls="shopping-bag" onClick={() => { setMegaMode('closed'); setOpen(false); setCartOpen(true) }}>
            <BagIcon />
            <span className="cart-count" aria-hidden="true">
              {count}
            </span>
          </button>
          <button
            ref={mobileTrigger}
            className="icon-btn menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" id="menu-movil" aria-label="Navegación móvil" data-lenis-prevent>
          {mobileLinks.map((item) => item.label === 'Tienda' ? <details key={item.href} className="mobile-shop"><summary>Tienda</summary><MegaMenu onSelect={goCatalog} mobile /></details> : (
            <a
              key={item.href}
              className="mobile-nav__link"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
