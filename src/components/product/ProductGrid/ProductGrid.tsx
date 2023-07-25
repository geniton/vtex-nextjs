import {
  VtexComponents,
  VtexUtils as AudacityVtexUtils,
} from '@retailhub/audacity-vtex'
import { memo } from 'react'

import type { ProductSummary_ProductFragment } from '@generated/graphql'
import styles from 'src/components/product/ProductGrid/product-grid.module.scss'
import { VtexUtils, VtexHooks, NextjsHooks } from 'src/utils'

interface Props {
  /**
   * Products listed on the grid.
   */
  products: Array<{ node: ProductSummary_ProductFragment }>
  page: number
  /**
   * Quantity of products listed.
   */
  pageSize: number
  controls: any
  [key: string]: any
}

function ProductGrid({
  products,
  page,
  pageSize,
  controls,
  gridNumber,
  ...otherProps
}: Props) {
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
      <ul
        data-fs-product-grid
        data-fs-product-grid-columns={gridNumber}
        className={styles.fsProductGrid}
      >
        {parsedProducts.map((product: any, idx: number) => (
          <li key={`${product.cacheId}`}>
            <VtexComponents.ProductCard
              controls={controls?.general?.cardControls}
              effects={controls?.effects?.cardEffects}
              style={controls?.style?.cardStyle}
              product={product}
              index={pageSize * page + idx + 1}
              VtexHooks={VtexHooks}
              VtexUtils={VtexUtils}
              NextjsHooks={NextjsHooks}
              {...otherProps}
            />
          </li>
        ))}
      </ul>
    </VtexComponents.ProductGallerySkeleton>
  )
}

export default memo(ProductGrid)
