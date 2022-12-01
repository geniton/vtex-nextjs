/* eslint-disable no-console */
import { Components } from '@retailhub/audacity-ui'
import { useEffect } from 'react'

import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import type { ProductsQueryQueryVariables } from '@generated/graphql'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import { getData, saveData } from 'src/utils/local-storage'
import { useSession } from 'src/sdk/session'
import storeConfig from 'store.config'

import ProductCard from '../../product/ProductCard'
import Section from '../Section'
import styles from './product-shelf.module.scss'

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
  const { person } = useSession()
  const products = useProductsQuery({
    first: 10,
    after: '',
    selectedFacets: selectedFacets ?? [],
    term: productIds ? `product:${productIds.join(';')}` : '',
  })

  useEffect(() => {
    async function getWishlistData() {
      return fetch(
        `${storeConfig.storeUrl}/api/dataentities/WL/search?_where=userId=${person?.id}&_sort=createdIn DESC&_fields=userId,products`
      )
        .then((res) => res.json())
        .then((res) => res)
    }

    if (person?.id) {
      getWishlistData().then((masterDataWishlist) => {
        const localWishlist = getData('wishlist') || []

        let wishlistProducts: number[] = []

        if (masterDataWishlist?.length) {
          wishlistProducts = JSON.parse(
            masterDataWishlist[0].products
          ).filter((item: string) => /^[0-9\b]+$/.test(item))
        }

        wishlistProducts = [...localWishlist, ...wishlistProducts]
        wishlistProducts = Array.from(new Set(wishlistProducts))

        saveData('wishlist', wishlistProducts)
      })
    }
  }, [person])

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
      <Components.Container>
        <h2 className="text__title-section layout__content">{title}</h2>
        <div className={styles.fsProductShelf} data-fs-product-shelf>
          <ProductShelfSkeleton
            loading={products === undefined}
            displayButton={cardControls?.showBuyButton}
          >
            <Components.Carousel
              {...carouselControls}
              mobileCarouselControls={mobileCarouselControls}
              applyMobileCarouselControls={applyMobileCarouselControls}
            >
              {products?.edges.map((product: any, idx: number) => (
                <article key={`${product.node.id}`}>
                  <ProductCard
                    product={product.node}
                    controls={controls}
                    index={idx + 1}
                  />
                </article>
              ))}
            </Components.Carousel>
          </ProductShelfSkeleton>
        </div>
      </Components.Container>
    </Section>
  )
}

export default ProductShelf
