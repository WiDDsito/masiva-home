import { useRef } from 'react'
import { useMotionValue, useSpring, motion, useReducedMotion } from 'motion/react'
import { transitionView } from '../lib/viewTransition'
import { useState } from 'react'
import { Button } from './Button'
import { ProductDetails } from './ProductDetails'
import { useCart } from '../lib/CartContext'
import type { CSSProperties } from 'react'
import type { DemoProduct } from '../content/demo'
import { formatPEN } from '../lib/format'
import { Photo } from './Photo'

const availabilityLabel: Record<DemoProduct['availability'], string> = {
  unconfirmed: 'Consultar disponibilidad',
  in_stock: 'Disponible',
  made_to_order: 'Bajo pedido',
}

interface Props {
  product: DemoProduct
  delay?: number
}

export function ProductCard({ product, delay = 0 }: Props) {
  const { add } = useCart()
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(x, { stiffness: 180, damping: 24 })
  const rotateY = useSpring(y, { stiffness: 180, damping: 24 })
  const card = useRef<HTMLElement>(null)
  const imageButton = useRef<HTMLButtonElement>(null)
  const resetTilt = () => { x.set(0); y.set(0) }
  const [detailsOpen, setDetailsOpen] = useState(false)
  return (
    <motion.article
      ref={card}
      onPointerMove={event => {
        if (reduced || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
        const rect = card.current!.getBoundingClientRect()
        x.set(((event.clientY - rect.top) / rect.height - .5) * -4)
        y.set(((event.clientX - rect.left) / rect.width - .5) * 4)
      }}
      onPointerLeave={resetTilt}
      onBlur={resetTilt}
      className="product"
      style={{ '--reveal-delay': `${delay}ms`, rotateX: reduced || detailsOpen ? 0 : rotateX, rotateY: reduced || detailsOpen ? 0 : rotateY, transformPerspective: 1000 } as CSSProperties}
    >
      <button ref={imageButton} className="product__image-button" type="button" aria-label={`Ver detalles de ${product.name}`} aria-haspopup="dialog" onClick={() => { resetTilt(); transitionView(() => setDetailsOpen(true)) }}>
      <Photo
        subject={product.name}
        detail={product.model}
        tone={product.tone}
        src={product.image}
        minimal
        className="product__media"
        transitionName={detailsOpen ? undefined : `product-${product.id}`}
      />
      </button>
      <div>
        <h3 className="product__name">{product.name}</h3>
        <p className="product__model">{product.color}</p><p className="product__model">{product.dimensions} (largo × alto × fondo)</p>
        <p className="product__price">{formatPEN(product.price)}</p>
        <p className="product__availability">
          <span
            className={product.availability === 'made_to_order' ? 'dot dot--wood' : 'dot'}
            aria-hidden="true"
          />
          {availabilityLabel[product.availability]}
        </p>
      </div>
      <Button variant="ghost" ariaLabel={`Agregar ${product.name} al carrito`} onClick={() => add(product.id)}>Agregar al carrito</Button>
      {detailsOpen && <ProductDetails product={product} onClose={async () => { await transitionView(() => setDetailsOpen(false)); imageButton.current?.focus({ preventScroll: true }) }} />}
    </motion.article>
  )
}
