import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
// import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import type { ProductsQueryQueryVariables } from '@generated/graphql'
import { Headerbar } from '@retailhub/audacity-ui'

import ProductCard from '../../product/ProductCard'
import Section from '../Section'
import styles from './product-shelf.module.scss'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import Carousel from 'src/audacity-ui/carousel'

interface ProductShelfProps extends Partial<ProductsQueryQueryVariables> {
  withDivisor?: boolean
}

function ProductShelf({
  withDivisor = false,
  content: { productIds },
  content: { title },
  controls,
  selectedFacets,
}: ProductShelfProps | any) {
  const products = useProductsQuery({
    first: 10,
    after: '',
    selectedFacets: selectedFacets ?? [],
    term: productIds ? `product:${productIds.join(';')}` : '',
  })

  if (products?.edges?.length === 0) {
    return null
  }

  const {
    general: {
      carouselControls,
      mobileCarouselControls,
      applyMobileCarouselControls,
      cardControls,
    },
  } = controls

  return (
    <Section
      className={`layout__section ${withDivisor ? 'section__divisor' : ''}`}
    >
      <div className="container">
        <h2 className="text__title-section layout__content">{title}</h2>
        <div className={styles.fsProductShelf} data-fs-product-shelf>
          <ProductShelfSkeleton
            loading={products === undefined}
            displayButton={cardControls?.showBuyButton}
          >
            <Carousel
              {...carouselControls}
              mobileCarouselControls={mobileCarouselControls}
              applyMobileCarouselControls={applyMobileCarouselControls}
            >
              {products?.edges.map((product: any, idx: any) => (
                <li key={`${product.node.id}`}>
                  <ProductCard
                    product={product.node}
                    controls={controls}
                    index={idx + 1}
                  />
                </li>
              ))}
            </Carousel>
          </ProductShelfSkeleton>
        </div>
      </div>
    </Section>
  )
}

export default ProductShelf
