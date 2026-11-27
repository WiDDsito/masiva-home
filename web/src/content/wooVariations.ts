export interface WooAttribute {
  name: string
  taxonomy?: string | null
  has_variations: boolean
  terms: { name: string; slug: string }[]
}

export interface WooVariationDefinition {
  id: number
  attributes: { name: string; value: string | null }[]
}

interface VariationAxis {
  key: string
  name: string
  terms: WooAttribute['terms']
}

export interface VariationGroup {
  axes: VariationAxis[]
  definitions: ReadonlyMap<number, WooVariationDefinition>
}

export function variationGroup(attributes: WooAttribute[], definitions: WooVariationDefinition[]): VariationGroup {
  return {
    axes: attributes.filter(attribute => attribute.has_variations).map(attribute => ({
      key: attribute.taxonomy || attribute.name,
      name: attribute.name,
      terms: attribute.terms,
    })),
    definitions: new Map(definitions.map(definition => [definition.id, definition])),
  }
}

type VariationValues = ReadonlyMap<string, string | null>

export function variationValues({ axes, definitions }: VariationGroup, id: number): VariationValues {
  const attrs = definitions.get(id)?.attributes ?? []
  const values = new Map<string, string | null>()

  for (const axis of axes) {
    // WooCommerce exposes labels in the parent's variation metadata, even for taxonomy attributes.
    if (axes.some(other => other !== axis && other.name === axis.name)) continue
    const entries = attrs.filter(attribute => attribute.name === axis.name)
    if (entries.length !== 1) continue

    const value = entries[0].value
    if (value === null || value === '') {
      values.set(axis.key, null)
    } else if (typeof value === 'string') {
      const slug = axis.terms.find(term => term.slug === value)?.slug
      const labels = axis.terms.filter(term => term.name === value)
      if (slug || labels.length <= 1) values.set(axis.key, slug || labels[0]?.slug || value)
    }
  }
  return values
}

export type VariationResolution =
  | { status: 'incomplete' | 'missing' | 'ambiguous' }
  | { status: 'matched'; id: number }

export function resolveWooVariation(
  axes: VariationAxis[],
  selection: ReadonlyMap<string, string>,
  variants: Iterable<{ id: number; values: VariationValues }>,
): VariationResolution {
  if (!axes.length) return { status: 'ambiguous' }
  if (axes.some(axis => !selection.has(axis.key))) return { status: 'incomplete' }

  const candidates = [...variants].filter(variant => axes.every(axis => {
    const value = variant.values.get(axis.key)
    return value == null || value === selection.get(axis.key)
  }))
  if (!candidates.length) return { status: 'missing' }

  const [match] = candidates
  if (candidates.length > 1 || axes.some(axis => !match.values.has(axis.key))) return { status: 'ambiguous' }
  return { status: 'matched', id: match.id }
}
