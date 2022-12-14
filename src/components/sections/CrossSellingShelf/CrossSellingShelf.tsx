import { useMemo } from 'react'
import { Components } from '@retailhub/audacity-ui'

const CrossSellingShelf = ({
  product,
  content: { kind },
  content,
  ...otherProps
}: any) => {
  const selectedFacets = useMemo(
    () => [{ key: kind, value: product.isVariantOf.productGroupID }],
    [kind, product.isVariantOf.productGroupID]
  )

  // content: ShowcaseContent
  // controls: ShowcaseControls
  // PlatformComponents?: any
  // PlatformHooks?: any
  // selectedFacets?: any foi

  return null

  return (
    <Components.Showcase
      content={content}
      selectedFacets={selectedFacets}
      {...otherProps}
    />
  )
}

export default CrossSellingShelf
