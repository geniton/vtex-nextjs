import { sendAnalyticsEvent } from '@faststore/sdk'
import { useCallback } from 'react'
import type { CurrencyCode, SelectItemEvent } from '@faststore/sdk'

import type { ProductSummary_ProductFragment } from '@generated/graphql'

import { useSession } from '../session'
import type { AnalyticsItem, SearchSelectItemEvent } from '../analytics/types'

export type ProductLinkOptions = {
  index: number
  product: ProductSummary_ProductFragment | any
  selectedOffer: number
}

function getSlug(product: any) {
  if (!product?.isVariantOf?.linkText || !product?.isVariantOf?.bestSku?.itemId)
    return null

  return `${product.isVariantOf.linkText}-${product.isVariantOf.bestSku.itemId}`
}

export const useProductLink = ({
  index,
  product,
  selectedOffer,
}: ProductLinkOptions) => {
  const slug = product.slug || getSlug(product)
  const {
    currency: { code },
  } = useSession()

  const onClick = useCallback(() => {
    sendAnalyticsEvent<SelectItemEvent<AnalyticsItem>>({
      name: 'select_item',
      params: {
        items: [
          {
            item_id: product.isVariantOf.productId,
            item_name: product.isVariantOf.name,
            item_brand: product.isVariantOf.brand,
            item_variant: product.isVariantOf.bestSku?.itemId,
            index,
            price: product.isVariantOf.bestSku?.bestSeller?.Price,
            discount:
              product.isVariantOf.bestSku?.bestSeller?.ListPrice -
              product.isVariantOf.bestSku?.bestSeller?.Price,
            currency: code as CurrencyCode,
            item_variant_name: product.isVariantOf.bestSku?.name,
            product_reference_id:
              product.isVariantOf.bestSku?.referenceId[0]?.Value,
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
            item_id: product.isVariantOf.productId,
            item_variant: product.isVariantOf.bestSku?.itemId,
            index,
          },
        ],
      },
    })
  }, [code, product, index, selectedOffer])

  return {
    href: `/${slug}/p`,
    onClick,
    'data-testid': 'product-link',
  }
}
