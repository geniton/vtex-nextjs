// import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

// import { mark } from 'src/sdk/tests/mark'
// import storeConfig from 'store.config'
// import { useProductsQuery, useProductsQueryPrefetch } from 'src/sdk/product/useProductsQuery'
// import { useEffect, useState } from 'react'

function Page() {
  // const [page, setPage] = useState(0)
  //   const products = useProductsQuery(
  //     {
  //       first: 10,
  //       term: '',
  //       selectedFacets: [{ key: 'productClusterIds', value: "150" }]
  //     }
  //   )

  //   const prefetch = useProductsQueryPrefetch({
  //     first: 10,
  //     sort: 'score_desc',
  //     after: (10 * (page ?? 0)).toString(),
  //     term: '',
  //     selectedFacets: [{ key: 'productClusterIds', value: "150" }]
  //   })

  //   useEffect(() => {
  //     prefetch()
  //   }, [page])

  return null

  return (
    <>
      {/* <NextSeo
        title={storeConfig.seo.title}
        description={storeConfig.seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
        }}
      />
      <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q`,
            queryInput: 'search_term_string',
          },
        ]}
      />
      <button disabled={!products?.pageInfo?.hasNextPage} onClick={() => {
        setPage(page + 1)
      }}> Pagination ({page + 1}) total products ({products?.edges.length})</button> */}
    </>
  )
}

export default Page
