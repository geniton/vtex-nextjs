import { Link } from '@faststore/ui'
import Image from 'next/image'

import Breadcrumb from 'src/components/sections/Breadcrumb'
import ProductGallery from 'src/components/sections/ProductGallery'
import ProductDetails from 'src/components/sections/ProductDetails'
import ProductShelf from 'src/components/sections/ProductShelf'
import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/search/SearchInput'
import { useSession } from 'src/sdk/session'
import CrossSellingShelf from 'src/components/sections/CrossSellingShelf'

const Components: any = {
  Link,
  Breadcrumb,
  ProductGallery,
  ProductDetails,
  Image,
  CartToggle,
  ProductShelf,
  SearchInput,
  useSession,
  CrossSellingShelf,
}

export default (componentName: string, props?: any, children?: any) => {
  const renderPlatformComponent = () => {
    const Component = Components[componentName]

    return children ? (
      <Component {...props}>{children}</Component>
    ) : (
      <Component {...props} />
    )
  }

  return Components[componentName] ? renderPlatformComponent() : null
}
