import { useSearch } from '@faststore/sdk'
import { memo, useMemo } from 'react'

import ProductGrid from 'src/components/product/ProductGrid'

import { useProducts } from './usePageProducts'

/* If showSponsoredProducts is true, a ProductTiles will be displayed in between two blocks of ProductGrid on the page 0 */
interface Props {
  page: number
  title: string
  showSponsoredProducts?: boolean
  controls: any
  gridNumber: number
}

function GalleryPage({
  controls,
  page,
  title,
  showSponsoredProducts = true,
  ...props
}: Props) {
  const products = useProducts(page) ?? []
  const { itemsPerPage } = useSearch()

  const productsSponsored = useMemo(
    () => (showSponsoredProducts ? products.slice(0, 2) : undefined),
    [products, showSponsoredProducts]
  )

  const middleItemIndex = useMemo(
    () => Math.ceil(itemsPerPage / 2),
    [itemsPerPage]
  )

  const shouldDisplaySponsoredProducts = useMemo(
    () => page === 0 && productsSponsored && productsSponsored.length > 1,
    [page, productsSponsored]
  )

  return (
    <>
      {shouldDisplaySponsoredProducts ? (
        <>
          <ProductGrid
            controls={controls}
            products={products.slice(0, middleItemIndex)}
            page={page}
            pageSize={middleItemIndex}
            {...props}
          />
          <div data-fs-product-listing-sponsored>
            <h3>Sponsored</h3>
            {/*
              TODO: Refactor this bit of code

              Sections should be self contained and should not import other sections.
              We should remove/refactor this section from here
            */}
            <ProductGrid
              controls={controls}
              products={products}
              page={page}
              pageSize={itemsPerPage}
              {...props}
            />
          </div>
          <ProductGrid
            controls={controls}
            products={products.slice(middleItemIndex, itemsPerPage)}
            page={page}
            pageSize={middleItemIndex}
            {...props}
          />
        </>
      ) : (
        <ProductGrid
          controls={controls}
          products={products}
          page={page}
          pageSize={itemsPerPage}
          {...props}
        />
      )}
    </>
  )
}

export default memo(GalleryPage)
