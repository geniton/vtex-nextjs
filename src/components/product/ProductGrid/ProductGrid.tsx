import { VtexComponents } from '@retailhub/audacity-vtex'
import { memo } from 'react'

import type { ProductSummary_ProductFragment } from '@generated/graphql'
import styles from 'src/components/product/ProductGrid/product-grid.module.scss'
import { VtexUtils, VtexHooks } from 'src/utils'

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
  ...otherProps
}: Props) {
  const parsedProducts = products.length
    ? products.map(({ node }: any) =>
        node?.data ? JSON.parse(node?.data) : null
      )
    : []

  return (
    <VtexComponents.ProductGallerySkeleton loading={parsedProducts.length === 0}>
      <ul data-fs-product-grid className={styles.fsProductGrid}>
        {parsedProducts.map((product, idx: number) => (
          <li key={`${product.isVariantOf.cacheId}`}>
            <VtexComponents.ProductCard
              controls={controls?.general?.cardControls}
              effects={controls?.effects?.cardEffects}
              style={controls?.style?.cardStyle}
              product={product}
              index={pageSize * page + idx + 1}
              VtexHooks={VtexHooks}
              VtexUtils={VtexUtils}
              {...otherProps}
            />
          </li>
        ))}
      </ul>
    </VtexComponents.ProductGallerySkeleton>
  )
}

export default memo(ProductGrid)
