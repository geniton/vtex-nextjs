import { useMemo } from 'react'

import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'

import ProductShelf from '../ProductShelf'

interface Props {
  product: ProductDetailsFragment_ProductFragment
  content: {
    kind: string
  }
}

const CrossSellingShelf = ({ product, content, content: { kind }, ...otherProps }: Props) => {
  const selectedFacets = useMemo(
    () => [{ key: kind, value: product.isVariantOf.productGroupID }],
    [kind, product.isVariantOf.productGroupID]
  )

  return (
    <ProductShelf content={content} selectedFacets={selectedFacets} {...otherProps} />
  )
}

export default CrossSellingShelf
