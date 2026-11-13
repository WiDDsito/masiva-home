import type { CSSProperties } from 'react'
import type { DemoCategory } from '../content/demo'
import { Photo } from './Photo'

interface Props {
  category: DemoCategory
  delay?: number
  onSelect?: (id: string) => void
}

export function CategoryTile({ category, delay = 0, onSelect }: Props) {
  return (
    <a
      className={`category ${category.featured ? 'category--feature' : ''}`.trim()}
      href="#catalogo"
      onClick={(event) => {
        event.preventDefault()
        onSelect?.(category.id)
      }}
      aria-label={`Ver ${category.name}`}
      data-reveal
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      <Photo
        subject={category.name}
        detail="Ambiente"
        tone={category.tone}
        src={category.image}
        minimal
      />
      <span className="category__body">
        <span className="category__name">{category.name}</span>
        <span className="category__count">{category.count} modelos</span>
      </span>
    </a>
  )
}
