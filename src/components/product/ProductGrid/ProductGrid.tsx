import { Components } from '@retailhub/audacity-ui'
import { memo } from 'react'

import type { ProductSummary_ProductFragment } from '@generated/graphql'
import styles from 'src/components/product/ProductGrid/product-grid.module.scss'
import { Hooks as PlatformHooks } from 'src/utils/components/platform'

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
  if (!products.length) return null

  const parsedProducts = products.map(({ node }: any) =>
    node?.data ? JSON.parse(node?.data) : null
  )

  return (
    <Components.ProductGallerySkeleton
      loading={!parsedProducts || parsedProducts.length === 0}
    >
      <ul data-fs-product-grid className={styles.fsProductGrid}>
        {parsedProducts.map((product, idx: number) => (
          <li key={`${product.isVariantOf.cacheId}`}>
            <Components.ProductCard
              controls={controls?.general?.cardControls}
              effects={controls?.effects?.cardEffects}
              style={controls?.style?.cardStyle}
              product={product}
              index={pageSize * page + idx + 1}
              PlatformHooks={PlatformHooks}
              {...otherProps}
            />
          </li>
        ))}
      </ul>
    </Components.ProductGallerySkeleton>
  )
}

export default memo(ProductGrid)
