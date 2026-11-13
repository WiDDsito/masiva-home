export function formatPEN(amount: number): string {
  if (amount <= 0) return 'Consultar'

  const value = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return `S/ ${value}`
}
