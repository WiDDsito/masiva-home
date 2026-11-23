interface ProductPhoto {
  src: string
  alt: string
  label?: string
}

export function ProductGallery({ photos, selected, onSelect }: { photos: ProductPhoto[]; selected: number; onSelect: (index: number) => void }) {
  const image = photos[selected]

  return (
    <div className="catalog-preview__gallery">
      <div className="catalog-preview__stage">
        {image && <img className="catalog-preview__image" src={image.src} alt={image.alt} width="800" height="800" decoding="async" />}
      </div>
      {photos.length > 1 && <div className="catalog-preview__thumbnails" aria-label="Fotografías del producto">
        {photos.map((photo, index) => (
          <button type="button" key={`${photo.src}-${index}`} aria-label={`Ver foto ${index + 1}${photo.label ? `: ${photo.label}` : ''}`} aria-pressed={index === selected} onClick={() => onSelect(index)}>
            <img src={photo.src} alt="" width="72" height="72" loading="lazy" />
          </button>
        ))}
      </div>}
    </div>
  )
}
