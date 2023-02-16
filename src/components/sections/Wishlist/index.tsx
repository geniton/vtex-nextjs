import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Components } from '@retailhub/audacity-ui'
import cn from 'classnames'
import router from 'next/router'

import ButtonLink from 'src/components/ui/Button/ButtonLink'
import { query } from 'src/sdk/product/useProductsQuery'
import * as LocalStorage from 'src/utils/local-storage'
import { useLazyQuery } from 'src/sdk/graphql/useLazyQuery'
import { useSession } from 'src/sdk/session'
import { Hooks as PlatformHooks } from 'src/utils/components/platform'

import styles from './wishlist.module.scss'

const Wishlist: React.FC<any> = ({ controls: { general, effects, style } }) => {
  const sessionData = useSession()
  const [fetchProducts, { data }]: any = useLazyQuery(query, {})
  const [listRemovedProducts, updateListRemovedProducts] = useState<any>([])

  const wishlistData: any = useMemo(() => {
    if (data?.search?.products?.edges?.length) {
      return data.search.products.edges
        .map(({ node }: any) => JSON.parse(node.data))
        .filter(
          (product: any) =>
            !product.isVariantOf.items.some((p: any) =>
              listRemovedProducts.includes(p.itemId)
            )
        )
    }

    if (data?.search?.products?.edges?.length === 0) {
      return []
    }

    return undefined
  }, [data, listRemovedProducts])

  const fetchData = useCallback(async () => {
    try {
      const masterDataWishlist = await fetch(
        `/api/wishlist?_where=userId=${sessionData.person?.id}&_sort=createdIn DESC&_fields=userId,products`
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
  }, [])

  useEffect(() => {
    const userID: string = sessionData.person?.id || ''

    if (!userID) {
      router.push('/login')

      return
    }

    fetchData()
  }, [sessionData])

  console.log('sessionData', sessionData)

  return (
    <section
      className={styles.wishlist}
      style={{
        backgroundColor: style?.bgColor,
      }}
    >
      <Components.Container
        className={cn({
          'mobile-only:p-0': general?.mobileVariations?.full,
          'lg:p-0': general?.deskVariations?.full,
        })}
      >
        <Components.ShowcaseSkeleton
          dots={false}
          loading={wishlistData === undefined}
        >
          {wishlistData?.length ? (
            <div data-fs-wishlist-products>
              {wishlistData?.map((product: any, index: number) => (
                <Components.ProductCard
                  product={product}
                  controls={general?.cardControls}
                  effects={effects?.cardEffects}
                  style={style?.cardStyle}
                  index={index + 1}
                  key={product.isVariantOf.cacheId}
                  onChangeLike={(skuId: string) =>
                    updateListRemovedProducts([...listRemovedProducts, skuId])
                  }
                  PlatformHooks={PlatformHooks}
                />
              ))}
            </div>
          ) : null}
        </Components.ShowcaseSkeleton>

        {wishlistData !== undefined && !wishlistData?.length && (
          <div className="text-center">
            <h3>Sua wishlist está sem produtos :(</h3>
            <p>
              para adicionar um navegue em nosso site e clique no coração dos
              produtos que gostar !
            </p>
            <ButtonLink
              className="bg-[color:var(--aud-primary)] text-white py-3 px-4 mt-2.5 inline-block text-base"
              href="/"
            >
              escolher produtos
            </ButtonLink>
          </div>
        )}
      </Components.Container>
    </section>
  )
}

export default Wishlist
