interface Props {
  /** Qué se fotografía. Se usa como texto alternativo y como pie. */
  transitionName?: string
  subject: string
  /** Detalle del pie: modelo, ambiente o medida. */
  detail?: string
  tone?: 'ivory' | 'greige' | 'wood' | 'dark'
  /** Sin monograma ni pie: para fondos a sangre donde el texto va encima. */
  minimal?: boolean
  /** Ruta de la imagen real. Si no hay imagen, se dibuja el marco. */
  src?: string
  /** Imagen por encima del pliegue: se carga de inmediato (LCP). */
  eager?: boolean
  className?: string
}

/**
 * Fotografía del producto o marco de «fotografía pendiente».
 * Cuando `src` está presente se muestra la imagen real a cubrir el marco;
 * cuando no, se conserva la proporción y se deja claro qué falta.
 */
export function Photo({ transitionName, subject, detail, tone = 'greige', minimal = false, src, eager = false, className }: Props) {
  const label = detail ? `${subject}. ${detail}` : subject

  return (
    <div
      className={`photo photo--${tone} ${className ?? ''}`.trim()}
      role={src ? undefined : 'img'}
      aria-label={src ? undefined : `Fotografía pendiente: ${label}`}
    >
      {src ? (
        <img
          className="photo__img"
          style={transitionName ? { viewTransitionName: transitionName } : undefined}
          src={src}
          alt={label}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          {...(eager ? { fetchpriority: 'high' } : {})}
        />
      ) : (
        !minimal && (
          <>
            <span className="photo__mark" aria-hidden="true">
              MH
            </span>
            <span className="photo__caption">
              <strong>{subject}</strong>
              {detail ? ` · ${detail}` : ''}
            </span>
          </>
        )
      )}
    </div>
  )
}
