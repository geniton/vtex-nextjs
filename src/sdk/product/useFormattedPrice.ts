import { useCallback, useMemo } from 'react'

interface PriceFormatterOptions {
  decimals?: boolean
}

export const usePriceFormatter = ({ decimals }: PriceFormatterOptions = {}) => {
  return useCallback(
    (price: number) =>
      Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: decimals ? 2 : 0,
      }).format(price),
    ['BRL', 'pt-BR', decimals]
  )
}

export const useFormattedPrice = (price: number) => {
  const formatter = usePriceFormatter()

  return useMemo(() => formatter(price), [formatter, price])
}
