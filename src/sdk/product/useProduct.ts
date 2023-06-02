import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const useProduct = (slug: string) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/api/product?slug=${slug}`,
    fetcher
  )

  return {
    error,
    isValidating,
    mutate,
    data,
  }
}
