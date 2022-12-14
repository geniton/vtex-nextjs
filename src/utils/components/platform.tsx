// components
import { Link } from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import Breadcrumb from 'src/components/sections/Breadcrumb'
import ProductGallery from 'src/components/sections/ProductGallery'
import ProductDetails from 'src/components/sections/ProductDetails'
import ProductShelf from 'src/components/sections/ProductShelf'
import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/search/SearchInput'
import CrossSellingShelf from 'src/components/sections/CrossSellingShelf'
import ProductCard from 'src/components/product/ProductCard'
import Wishlist from 'src/components/sections/Wishlist'
// hooks
import { useSession } from 'src/sdk/session'
import {
  useProductsQuery,
  useProductsQueryPrefetch,
} from 'src/sdk/product/useProductsQuery'
import { useProductLink } from 'src/sdk/product/useProductLink'

export const Hooks = {
  useSession,
  useProductsQuery,
  useProductsQueryPrefetch,
  useProductLink
}

export const Components = {
  Breadcrumb,
  CartToggle,
  CrossSellingShelf,
  Image: ({ preload, fetchPriority, ...otherProps }: any) => (
    <Image {...otherProps} withoutThumborOptions />
  ),
  Link,
  ProductGallery,
  ProductDetails,
  ProductShelf,
  ProductCard,
  SearchInput,
  Wishlist,
}
