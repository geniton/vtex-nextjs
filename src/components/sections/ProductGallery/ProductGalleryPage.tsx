import { useSearch } from '@faststore/sdk'
import { memo } from 'react'

import {
  VtexComponents,
  VtexUtils as AudacityVtexUtils,
} from '@retailhub/audacity-vtex'

import { useProducts } from './usePageProducts'

/* If showSponsoredProducts is true, a ProductTiles will be displayed in between two blocks of ProductGrid on the page 0 */
interface Props {
  page: number
  title: string
  showSponsoredProducts?: boolean
  controls: any
  gridNumber: number
  VtexUtils?: any
  VtexHooks?: any
  NextjsHooks?: any
}

function GalleryPage({
  controls,
  page,
  title,
  showSponsoredProducts = true,
  gridNumber,
  VtexUtils,
  VtexHooks,
  NextjsHooks,
  ...otherProps
}: Props) {
  const products = useProducts(page) ?? []
  const { itemsPerPage } = useSearch()

  const parsedProducts = products.length
    ? products.map(({ node }: any) => {
        const data = node?.data ? JSON.parse(node?.data) : null
        const formattedData = AudacityVtexUtils.Formats.formatProduct(
          data.isVariantOf
        )

        return formattedData
      })
    : []

  return (
    <VtexComponents.ProductGallerySkeleton
      loading={parsedProducts.length === 0}
      gridNumber={gridNumber}
    >
      {parsedProducts.map((product: any, idx: number) =>
        product?.cacheId ? (
          <li key={`${product.cacheId}`}>
            <VtexComponents.ProductCard
              controls={controls?.general?.cardControls}
              effects={controls?.effects?.cardEffects}
              style={controls?.style?.cardStyle}
              product={product}
              index={itemsPerPage * page + idx + 1}
              VtexUtils={VtexUtils}
              VtexHooks={VtexHooks}
              NextjsHooks={NextjsHooks}
              {...otherProps}
            />
          </li>
        ) : null
      )}
    </VtexComponents.ProductGallerySkeleton>
  )
}

export default memo(GalleryPage)
