import { Link } from "@faststore/ui"
import Breadcrumb from 'src/components/sections/Breadcrumb'
import ProductGallery from 'src/components/sections/ProductGallery'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import ProductDetails from 'src/components/sections/ProductDetails'
import CartToggle from 'src/components/cart/CartToggle'
import Image from "next/image"

const Components: any = {
  link: Link,
  breadcrumb: Breadcrumb,
  productGallery: ProductGallery,
  breadcrumbJsonLd: BreadcrumbJsonLd,
  nextSeo: NextSeo,
  productJsonLd: ProductJsonLd,
  productDetails: ProductDetails,
  image: Image,
  cartToggle: CartToggle
}

export default (componentName: string, props?: any, children?: any) => {
  const renderComponent = () => {
    const Component = Components[componentName]
    return children ? <Component {...props}>{children}</Component> : <Component {...props} />
  }
  return Components[componentName] ? renderComponent() : null
}
