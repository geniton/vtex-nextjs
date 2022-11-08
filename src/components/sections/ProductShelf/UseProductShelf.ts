import { useProductsQuery } from "src/sdk/product/useProductsQuery"

export const UseProductsShelf = () => {
    // const {
    //   itemsPerPage,
    //   state: { sort, term, selectedFacets },
    // } = useSearch()
  
    return useProductsQuery(
        {
          first: 5,
          after: '',
          term:"wooden",
          sort: 'score_desc' as const,
          selectedFacets: [{ key: 'id', value: '6' }],
        },
        { suspense: true }
      )
}