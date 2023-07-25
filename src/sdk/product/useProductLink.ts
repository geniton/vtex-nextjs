import { sendAnalyticsEvent } from '@faststore/sdk'
import { useCallback, useMemo } from 'react'
import type { CurrencyCode, SelectItemEvent } from '@faststore/sdk'
import { VtexUtils } from '@retailhub/audacity-vtex'

import type { ProductSummary_ProductFragment } from '@generated/graphql'

import { useSession } from '../session'
import type { AnalyticsItem, SearchSelectItemEvent } from '../analytics/types'

export type ProductLinkOptions = {
  index: number
  product: ProductSummary_ProductFragment | any
  currentSku?: ProductSummary_ProductFragment | any
  selectedOffer: number
}

function getSlug(product: any) {
  const { linkText } = product
  const itemId = product?.bestSku?.itemId

  if (!linkText || !itemId) return null

  return `${product.linkText}-${product.bestSku.itemId}`
}

export const useProductLink = ({
  index,
  product,
  currentSku,
  selectedOffer,
}: ProductLinkOptions) => {
  const productData = useMemo(
    () =>
      typeof product?.data === 'string'
        ? VtexUtils.Formats.formatProduct(JSON.parse(product.data).isVariantOf)
        : product,
    [product]
  )

  const slug = currentSku?.slug || productData.slug || getSlug(productData)
  const {
    currency: { code },
  } = useSession()

  const onClick = useCallback(() => {
    sendAnalyticsEvent<SelectItemEvent<AnalyticsItem>>({
      name: 'select_item',
      params: {
        items: [
          {
            item_id: productData.productId,
            item_name: productData.productName,
            item_brand: productData.brand,
            item_variant: currentSku
              ? currentSku.itemId
              : productData.bestSku?.itemId,
            index,
            price: currentSku
              ? currentSku.bestSeller?.commertialOffer?.Price
              : productData.bestSku?.bestSeller?.commertialOffer?.Price,
            discount: currentSku
              ? currentSku.bestSeller?.commertialOffer?.ListPrice -
                currentSku.bestSeller?.commertialOffer?.Price
              : productData.bestSku?.bestSeller?.commertialOffer?.ListPrice -
                productData.bestSku?.bestSeller?.commertialOffer?.Price,
            currency: code as CurrencyCode,
            item_variant_name: currentSku
              ? currentSku.name
              : productData.bestSku.name,
            product_reference_id: currentSku
              ? currentSku.referenceId?.[0]?.Value
              : productData.bestSku.referenceId?.[0]?.Value,
          },
        ],
      },
    })

    sendAnalyticsEvent<SearchSelectItemEvent>({
      name: 'search_select_item',
      params: {
        url: window.location.href,
        items: [
          {
            item_id: productData.productId,
            item_variant: currentSku
              ? currentSku.itemId
              : productData.bestSku?.itemId,
            index,
          },
        ],
      },
    })
  }, [code, productData, index, selectedOffer])

  return {
    href: `/${slug}/p`,
    onClick,
    'data-testid': 'product-link',
  }
}
