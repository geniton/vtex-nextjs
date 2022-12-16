import React, { useCallback, useEffect, useState } from 'react'
import { Components } from '@retailhub/audacity-ui'
import cn from 'classnames'

import ProductCard from 'src/components/product/ProductCard'
import ButtonLink from 'src/components/ui/Button/ButtonLink'
import { query } from 'src/sdk/product/useProductsQuery'
import * as LocalStorage from 'src/utils/local-storage'
import { useLazyQuery } from 'src/sdk/graphql/useLazyQuery'
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useSession } from 'src/sdk/session'

import styles from './wishlist.module.scss'

const Wishlist: React.FC<any> = ({
  controls,
  controls: {
    general: { cardControls, mobileVariations, deskVariations },
  },
}) => {
  const sessionData = useSession()
  const [loading, setLoading] = useState(true)
  const [fetchProducts, { data }]: any = useLazyQuery(query, {})

  const updateWishlist = useCallback(async () => {
    const localWishlist = LocalStorage.getData('wishlist') || []

    const variables: any = {
      first: 10,
      sort: 'score_desc',
      selectedFacets: [],
      term: `sku:${localWishlist.join(';')}`,
    }

    await fetchProducts(variables)
  }, [fetchProducts])

  // function saveLocalStorage(products: number[]) {
  //   StorageUtils.saveData('wishlist', products)
  // }

  // function removeProduct(productId: number) {
  //   const newProducts = data.filter((product) => product !== productId)

  //   saveLocalStorage(newProducts)
  //   setData(newProducts)
  // }

  useEffect(() => {
    const userId: any = sessionData.person?.id

    if (!userId) {
      setLoading(false)

      return
    }

    async function fetchData() {
      try {
        const masterDataWishlist = await fetch(
          `/api/wishlist?_where=userId=${userId}&_sort=createdIn DESC&_fields=userId,products`
        ).then((res) => res.json())

        const localWishlist = LocalStorage.getData('wishlist') || []

        let finalProductIds: string[] = []

        if (masterDataWishlist.length) {
          finalProductIds = JSON.parse(masterDataWishlist[0].products).filter(
            (item: string) => /^[0-9\b]+$/.test(item)
          )
        }

        finalProductIds = Array.from(
          new Set([...localWishlist, ...finalProductIds])
        )

        LocalStorage.saveData('wishlist', finalProductIds)

        const variables: any = {
          first: 10,
          sort: 'score_desc',
          selectedFacets: [],
          term: `sku:${finalProductIds.join(';')}`,
        }

        await fetchProducts(variables)
      } catch (err) {
        console.log(err)
      }

      setLoading(false)
    }

    fetchData()
  }, [fetchProducts])

  let products = []

  if (data?.search?.products?.edges.length) {
    products = data.search.products.edges.map(({ node }: any) =>
      JSON.parse(node.data)
    )
  }

  return null

  return (
    <section className={styles.wishlist}>
      <Components.Container
        className={cn({
          'mobile-only:p-0': mobileVariations.full,
          'lg:p-0': deskVariations.full,
        })}
      >
        <ProductShelfSkeleton
          loading={loading}
          displayButton={cardControls?.showBuyButton}
        >
          {products?.length ? (
            <div data-fs-wishlist-products>
              {products.map((product: any, idx: number) => (
                <ProductCard
                  product={product}
                  controls={controls}
                  index={idx + 1}
                  key={`${product.id}`}
                  onChangeLike={() => updateWishlist()}
                />
              ))}
            </div>
          ) : (
            <div data-fs-wishlist-content>
              <h3>Sua wishlist está sem produtos :(</h3>
              <p>
                para adicionar um navegue em nosso site e clique no coração dos
                produtos que gostar !
              </p>
              <ButtonLink data-fs-wishlist-button href="/">
                escolher produtos
              </ButtonLink>
            </div>
          )}
        </ProductShelfSkeleton>
      </Components.Container>
    </section>
  )
}

export default Wishlist
