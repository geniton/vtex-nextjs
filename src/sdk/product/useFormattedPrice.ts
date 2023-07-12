import { useCallback, useMemo } from 'react'

interface PriceFormatterOptions {
  decimals?: boolean
}

export const usePriceFormatter = ({ decimals }: PriceFormatterOptions = {}) => {
  return useCallback(
    (price: number) => price ? price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : '',
    ['brl', 'pt-BR', decimals]
  )
}

export const useFormattedPrice = (price: number) => {
  const formatter = usePriceFormatter()

  return useMemo(() => formatter(price), [formatter, price])
}
