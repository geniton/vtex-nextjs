import { formatSearchState, initSearchState } from '@faststore/sdk'
import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'
import { VtexComponents } from '@retailhub/audacity-vtex'

export const formatSearchPath = (term: string) => {
  const { pathname, search } = formatSearchState(
    initSearchState({
      term,
      base: '/s',
    })
  )

  return `${pathname}${search}`
}

export interface SearchInputContextValue {
  onSearchInputSelection?: (term: string, path: string) => void
}

const SearchInputContext = createContext<SearchInputContextValue | null>(null)

export function SearchInputProvider({
  onSearchInputSelection,
  children,
}: PropsWithChildren<SearchInputContextValue>) {
  return (
    <SearchInputContext.Provider value={{ onSearchInputSelection }}>
      {children}
    </SearchInputContext.Provider>
  )
}

const useSearchInput = () => {
  const context = useContext(SearchInputContext)
  const { onToggleNav } = useContext(VtexComponents.HeaderContext)

  if (!context) {
    throw new Error('Do not use outside the SearchInputContext context.')
  }

  return {
    ...context,
    onToggleNav
  }
}

export default useSearchInput
