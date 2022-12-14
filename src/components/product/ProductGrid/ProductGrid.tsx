import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import styles from 'src/components/product/ProductGrid/product-grid.module.scss'
import { Components } from '@retailhub/audacity-ui'

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
}

function ProductGrid({ products, page, pageSize, controls }: Props) {
  if (!products.length) return null

  const parsedProducts = products.map(({ node }: any) => node?.data ? JSON.parse(node?.data) : null)
  
  return (
    <ProductGridSkeleton loading={parsedProducts.length === 0}>
      <ul data-fs-product-grid className={styles.fsProductGrid}>
        {parsedProducts.map((product, idx: number) => (
          <li key={`${product.id}`}>
            <Components.ProductCard
              controls={controls}
              product={product}
              index={pageSize * page + idx + 1}
            />
          </li>
        ))}
      </ul>
    </ProductGridSkeleton>
  )
}

export default ProductGrid
