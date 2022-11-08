import React from 'react'
import { Components } from '@retailhub/audacity-ui'
import ProductDetails from '../../audacity-ui/product-details'
import ProductGallery from '../../audacity-ui/product-gallery'
import ProductShelf from '../../audacity-ui/product-shelf'
import CrossSellingShelf from '../../audacity-ui/cross-selling-shelf'

const RenderComponents: React.FC<any> = ({ pageData, ...rest }) => {
  return pageData.map(({ componentName, componentProps, id }: any) => {
    const properties = {
      ...componentProps,
      ...rest,
    }

    if (componentName === 'ProductDetails') {
      return <ProductDetails key={id} {...properties} />
    }

    if (componentName === 'ProductGallery') {
      return <ProductGallery key={id} {...properties} />
    }

    if (componentName === 'ProductShelf') {
      return <ProductShelf key={id} {...properties} />
    }

    if (componentName === 'CrossSellingShelf') {
      return <CrossSellingShelf key={id} {...properties} />
    }

    const Component = Components[componentName as keyof typeof Components]
    return Component ? <Component key={id} {...properties} /> : null
  })
}

export default RenderComponents
