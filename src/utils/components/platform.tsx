// components
import { Link } from '@faststore/ui'
import router from 'next/router'
import { sendAnalyticsEvent } from '@faststore/sdk'

import { Image } from 'src/components/ui/Image'
import Breadcrumb from 'src/components/sections/Breadcrumb'
import ProductGallery from 'src/components/sections/ProductGallery'
import ProductDetails from 'src/components/sections/ProductDetails'
import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/search/SearchInput'
import CrossSellingShelf from 'src/components/sections/CrossSellingShelf'
import Wishlist from 'src/components/sections/Wishlist'
// hooks
import { useSession } from 'src/sdk/session'
import {
  useProductsQuery,
  useProductsQueryPrefetch,
  query,
} from 'src/sdk/product/useProductsQuery'
import { useProductLink } from 'src/sdk/product/useProductLink'
import { useLazyQuery } from 'src/sdk/graphql/useLazyQuery'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useCheckoutButton } from 'src/sdk/cart/useCheckoutButton'
import { useRemoveButton } from 'src/sdk/cart/useRemoveButton'
import { cartStore, useCart } from 'src/sdk/cart'
import { useUI } from 'src/sdk/ui/Provider'

export const Hooks = {
  useSession,
  useLazyQuery,
  useProductsQuery,
  useProductsQueryPrefetch,
  useProductLink,
  useBuyButton,
  useCheckoutButton,
  useRemoveButton,
  useCart,
  useUI,
  query,
  router,
}

export const Queries = {
  productQuery: query,
  useProductsQueryPrefetch,
}

export const Utils = {
  cartStore,
  sendAnalyticsEvent,
}

export const Components = {
  Breadcrumb,
  CartToggle,
  CrossSellingShelf,
  Image: ({
    preload,
    fetchPriority,
    className,
    options,
    ...otherProps
  }: any) => (
    <Image className={className} {...otherProps} withoutThumborOptions />
  ),
  Link,
  ProductGallery,
  ProductDetails,
  SearchInput,
  Wishlist,
}
