interface Props {
  value: string
  className?: string
  label?: string
}

export function Cota({ value, className, label = 'Medida de referencia' }: Props) {
  return (
    <span className={`cota ${className ?? ''}`.trim()}>
      <span className="cota__line" aria-hidden="true" />
      <span className="visually-hidden">{label}: </span>
      <span>{value}</span>
    </span>
  )
}
