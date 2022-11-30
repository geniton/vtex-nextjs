// components
import { Link } from '@faststore/ui'
import Image from 'next/image'

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

export const Hooks = {
  useSession,
  useProductsQuery,
  useProductsQueryPrefetch,
}

export const Components = {
  Breadcrumb,
  CartToggle,
  CrossSellingShelf,
  Image,
  Link,
  ProductGallery,
  ProductDetails,
  ProductShelf,
  ProductCard,
  SearchInput,
  Wishlist,
}