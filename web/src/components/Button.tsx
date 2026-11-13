import { Magnetic } from './Magnetic'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props {
  ariaLabel?: string
  variant?: 'primary' | 'ghost'
  block?: boolean
  href?: string
  external?: boolean
  onClick?: () => void
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  children: ReactNode
  className?: string
}

export function Button({
  ariaLabel,
  variant = 'primary',
  block = false,
  href,
  external = false,
  onClick,
  type = 'button',
  children,
  className,
}: Props) {
  const classes = ['btn', `btn--${variant}`, block ? 'btn--block' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <Magnetic className={block ? 'magnetic--block' : undefined}><a
        aria-label={ariaLabel}
        className={classes}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a></Magnetic>
    )
  }

  return (
    <Magnetic className={block ? 'magnetic--block' : undefined}><button aria-label={ariaLabel} className={classes} type={type} onClick={onClick}>
      {children}
    </button></Magnetic>
  )
}
