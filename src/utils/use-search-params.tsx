import { useMemo } from 'react'
import type { SearchState } from '@faststore/sdk'
import {
  formatSearchState,
  parseSearchState,
} from '@faststore/sdk'
import { useRouter } from 'next/router'
import type {
  ServerCollectionPageQueryQuery,
} from '@generated/graphql'

type Props = ServerCollectionPageQueryQuery

export default function useSearchParams({ collection }: Props): SearchState {
  const selectedFacets = collection?.meta.selectedFacets || []
  const { asPath } = useRouter()

  const hrefState = useMemo(() => {
    const newState = parseSearchState(new URL(asPath, 'http://localhost'))

    // In case we are in an incomplete url
    if (newState.selectedFacets.length === 0) {
      newState.selectedFacets = selectedFacets
    }

    return formatSearchState(newState).href
  }, [asPath, selectedFacets])

  return useMemo(() => parseSearchState(new URL(hrefState)), [hrefState])
}
