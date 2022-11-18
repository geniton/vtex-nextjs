import { useSearch } from '@faststore/sdk'

import ProductGrid from 'src/components/product/ProductGrid'
import Sentinel from 'src/sdk/search/Sentinel'

import ProductTiles from '../ProductTiles'
import { useProducts } from './usePageProducts'

/* If showSponsoredProducts is true, a ProductTiles will be displayed in between two blocks of ProductGrid on the page 0 */
interface Props {
  page: number
  title: string
  showSponsoredProducts?: boolean
  controls: any
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

  const productsSponsored = showSponsoredProducts
    ? products.slice(0, 2)
    : undefined

  const middleItemIndex = Math.ceil(itemsPerPage / 2)

  const shouldDisplaySponsoredProducts =
    page === 0 && productsSponsored && productsSponsored.length > 1

  return (
    <>
      <Sentinel
        products={products}
        page={page}
        pageSize={itemsPerPage}
        title={title}
      />
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
            <ProductTiles
              controls={controls}
              selectedFacets={[{ key: 'productClusterIds', value: '141' }]}
              title=""
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

export default GalleryPage
