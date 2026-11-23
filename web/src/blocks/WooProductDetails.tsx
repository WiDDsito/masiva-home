import { useEffect, useState } from 'react'
import { loadWooProduct, loadWooVariations } from '../content/wooCatalog'
import { resolveWooVariation } from '../content/wooVariations'
import type { VariationResolution } from '../content/wooVariations'
import { Button } from '../components/Button'
import { ProductGallery } from '../components/ProductGallery'
import { WooAddToCart } from '../components/WooAddToCart'
import type { WooAddItem } from '../lib/wooCart'
import '../styles/catalog.css'

type Product = NonNullable<Awaited<ReturnType<typeof loadWooProduct>>>
type DetailsState =
  | { status: 'loading' | 'missing' | 'error' }
  | { status: 'ready'; product: Product }

export function WooProductDetails({ id, catalogHref }: { id: number | null; catalogHref: string }) {
  const [details, setDetails] = useState<DetailsState>({ status: id === null ? 'missing' : 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (id === null) return
    const controller = new AbortController()
    void loadWooProduct(id, controller.signal).then(product => {
      if (!controller.signal.aborted) {
        setDetails(product ? { status: 'ready', product } : { status: 'missing' })
      }
    }).catch(() => {
      if (!controller.signal.aborted) setDetails({ status: 'error' })
    })
    return () => controller.abort()
  }, [id, attempt])

  return (
    <section className="catalog-page woo-product-details" aria-labelledby="woo-product-title">
      <div className="container">
        <a className="link woo-product-details__back" href={catalogHref}>Volver al catálogo</a>
        {details.status === 'ready' ? (
          <WooProductContent product={details.product} />
        ) : (
          <div className="catalog-page__empty">
            <h1 id="woo-product-title">{details.status === 'missing' ? 'Producto no encontrado' : 'Ficha del producto'}</h1>
            {details.status === 'loading' && <p role="status">Cargando producto de WooCommerce…</p>}
            {details.status === 'error' && <>
              <p role="alert">No pudimos cargar el producto de WooCommerce.</p>
              <Button variant="ghost" onClick={() => {
                setDetails({ status: 'loading' })
                setAttempt(value => value + 1)
              }}>Volver a intentar</Button>
            </>}
          </div>
        )}
      </div>
    </section>
  )
}

type Variants = Awaited<ReturnType<typeof loadWooVariations>>
type VariantsState =
  | { status: 'loading' | 'error' }
  | { status: 'ready'; items: Variants }

interface Selection {
  values: ReadonlyMap<string, string>
  resolution: VariationResolution
}

const emptySelection: Selection = { values: new Map(), resolution: { status: 'incomplete' } }

function WooProductContent({ product }: { product: Product }) {
  const group = product.variationGroup
  const [variants, setVariants] = useState<VariantsState>({ status: 'loading' })
  const [variantAttempt, setVariantAttempt] = useState(0)
  const [selection, setSelection] = useState(emptySelection)
  const [photo, setPhoto] = useState(0)

  useEffect(() => {
    if (!group) return
    const controller = new AbortController()
    void loadWooVariations(product.id, group, controller.signal).then(items => {
      if (!controller.signal.aborted) setVariants({ status: 'ready', items })
    }).catch(() => {
      if (!controller.signal.aborted) setVariants({ status: 'error' })
    })
    return () => controller.abort()
  }, [product.id, group, variantAttempt])

  const { resolution } = selection
  const selected = resolution.status === 'matched' && variants.status === 'ready'
    ? variants.items.get(resolution.id)
    : undefined
  const displayed = selected ?? product
  const item: Omit<WooAddItem, 'quantity'> | undefined = group
    ? selected && {
      id: selected.id,
      variation: group.axes.map(({ key }) => ({ attribute: key, value: selection.values.get(key)! })),
    }
    : { id: product.id }
  const photos = selected?.photos.some(image => image.src !== product.photos[0]?.src)
    ? selected.photos
    : product.photos

  function choose(key: string, value: string) {
    if (!group || variants.status !== 'ready') return
    const items = variants.items
    setSelection(current => {
      const values = new Map(current.values)
      if (value) values.set(key, value)
      else values.delete(key)
      return { values, resolution: resolveWooVariation(group.axes, values, items.values()) }
    })
    setPhoto(0)
  }

  return (
    <div className={`catalog-preview__layout${photos.length ? '' : ' woo-product-details__layout--no-photo'}`} data-variation-id={selected?.id}>
      {photos.length > 0 && <ProductGallery photos={photos} selected={photo} onSelect={setPhoto} />}
      <div className="catalog-preview__body">
        <h1 id="woo-product-title">{product.name}</h1>
        <div className="woo-product-details__pricing" aria-live="polite">
          <p className="catalog-preview__price">{displayed.priceLabel}</p>
          <p className="catalog-preview__availability">{displayed.availability}</p>
        </div>
        {group && (variants.status === 'loading' ? <p role="status">Cargando variantes…</p>
          : variants.status === 'error' ? <>
            <p role="alert">No pudimos cargar las variantes de WooCommerce.</p>
            <Button variant="ghost" onClick={() => {
              setVariants({ status: 'loading' })
              setVariantAttempt(value => value + 1)
            }}>Reintentar carga de variantes</Button>
          </>
          : variants.status === 'ready' && variants.items.size === 0 ? <p role="status">WooCommerce no publicó variantes para este producto.</p>
          : !group.axes.length || group.axes.some(axis => !axis.terms.length) ? <p role="status">No pudimos identificar las opciones de este producto.</p>
          : <fieldset className="woo-product-details__variants">
            <legend>Elige una variante</legend>
            {group.axes.map(axis => <label key={axis.key}>
              <span>{axis.name}</span>
              <select value={selection.values.get(axis.key) ?? ''} onChange={event => choose(axis.key, event.target.value)}>
                <option value="">Selecciona una opción</option>
                {axis.terms.map(term => <option key={term.slug} value={term.slug}>{term.name}</option>)}
              </select>
            </label>)}
            <p role="status">
              {resolution.status === 'incomplete' ? 'Completa la selección para ver los datos de la variante.'
                : resolution.status === 'missing' ? 'Esta combinación no existe.'
                : resolution.status === 'ambiguous' ? 'No pudimos identificar una variante para esta selección.'
                : ''}
            </p>
            {selection.values.size > 0 && <Button variant="ghost" onClick={() => {
              setSelection(emptySelection)
              setPhoto(0)
            }}>Limpiar selección</Button>}
          </fieldset>)}
        {import.meta.env.DEV && <WooAddToCart key={item?.id ?? product.id} item={item} purchase={displayed.purchase} />}
      </div>
    </div>
  )
}
