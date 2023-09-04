import { useMemo } from 'react'
import type { SearchState } from '@faststore/sdk'
import { formatSearchState, parseSearchState } from '@faststore/sdk'
import { useRouter } from 'next/router'

import type { ServerCollectionPageQueryQuery } from '@generated/graphql'

type Props = ServerCollectionPageQueryQuery

export default function useSearchParams({ collection }: Props): SearchState {
  const selectedFacets = collection?.meta.selectedFacets || []
  const { asPath } = useRouter()

  const hrefState = useMemo(() => {
    const url = new URL(asPath, 'http://localhost')
    const newState = parseSearchState(url)

    const parameters = Object.fromEntries(url.searchParams.entries())
    const paramKeys = newState?.selectedFacets?.length
      ? newState.selectedFacets.map(({ key }: { key: string }) => key)
      : []

    for (const key in parameters) {
      if (
        key === 'productClusterIds' ||
        key === 'c' ||
        key === 'brand' ||
        key === 'sellername' ||
        (key && key.includes('specificationFilter_'))
      ) {
        if (!paramKeys.includes(key)) {
          newState.selectedFacets.push({
            key,
            value: parameters[key],
          })
        }
      }
    }

    // In case we are in an incomplete url
    if (newState.selectedFacets.length === 0) {
      newState.selectedFacets = selectedFacets
    }

    return formatSearchState(newState).href
  }, [asPath, selectedFacets])

  return useMemo(() => parseSearchState(new URL(hrefState)), [hrefState])
}
