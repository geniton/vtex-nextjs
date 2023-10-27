import { sendAnalyticsEvent } from '@faststore/sdk'
import { useCallback } from 'react'
import type { CurrencyCode, AddToCartEvent } from '@faststore/sdk'

import type { AnalyticsItem } from 'src/sdk/analytics/types'
import type { CartItem } from 'src/sdk/cart'
import { useCart, cartStore } from 'src/sdk/cart'
import storeConfig from 'store.config'

import { useSession } from '../session'
import { useUI } from '../ui/Provider'

export const useBuyButton = (item: CartItem | any) => {
  const { openCart } = useUI()
  const cart = useCart()
  const {
    currency: { code },
  } = useSession()

  const { confirmationModal, ...otherPropsItem } = item ?? {}

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, goToCheckout: boolean) => {
      const { checkoutUrl } = storeConfig

      e.preventDefault()

      if (!item) {
        return
      }

      // start product confirmation modal
      const {
        confirmationModalData,
        showProductConfirmation,
        onConfirmationModalData,
        activeVariations,
      } = confirmationModal ?? {}

      if (
        Object.keys(activeVariations)?.length &&
        showProductConfirmation &&
        !confirmationModalData?.isOpen &&
        typeof onConfirmationModalData === 'function'
      ) {
        onConfirmationModalData({
          isOpen: true,
          goToCheckout,
          activeVariations,
        })

        return
      }
      // end

      sendAnalyticsEvent<AddToCartEvent<AnalyticsItem>>({
        name: 'add_to_cart',
        params: {
          currency: code as CurrencyCode,
          // TODO: In the future, we can explore more robust ways of
          // calculating the value (gift items, discounts, etc.).
          value: item.price * item.quantity,
          items: [
            {
              item_id: item.itemOffered.isVariantOf.productGroupID,
              item_name: item.itemOffered.isVariantOf.name,
              item_brand: item.itemOffered.brand.name,
              item_variant: item.itemOffered.sku,
              quantity: item.quantity,
              price: item.price,
              discount: item.listPrice - item.price,
              currency: code as CurrencyCode,
              item_variant_name: item.itemOffered.name,
              product_reference_id: item.itemOffered.gtin,
            },
          ],
        },
      })

      cartStore.addItem(otherPropsItem)

      if (!goToCheckout) {
        openCart()
      }

      if (goToCheckout && !cart.isValidating && cart.id) {
        setTimeout(() => {
          window.location.href = `${checkoutUrl}?orderFormId=${cart.id}`
        }, 500)
      }
    },
    [code, item, openCart, cart?.isValidating, cart?.id]
  )

  return {
    onClick,
    'data-testid': 'buy-button',
    'data-sku': item?.itemOffered.sku,
    'data-seller': item?.seller.identifier,
  }
}
