import { useEffect, useMemo, useState } from 'react'
import { Components } from '@retailhub/audacity-ui'
import type {
  ShowcaseContent,
  ShowcaseControls,
} from '@retailhub/audacity-ui/dist/components/showcase/types'

import {
  Hooks as PlatformHooks,
  Components as PlatformComponents,
} from 'src/utils/components/platform'
import storeConfig from 'store.config'

interface ContentProps extends ShowcaseContent {
  kind?: string
}

type Props = {
  content: ContentProps
  controls: ShowcaseControls
}

const CrossSellingShelf = ({ content, controls }: Props) => {
  const [productId, setProductId] = useState('')

  const { type } = content ?? {}

  const selectedFacets = useMemo(
    () => [{ key: type, value: productId }],
    [type, productId]
  )

  useEffect(() => {
    const $productPage = document.querySelector('#product-page')

    if ($productPage) {
      const $attr = $productPage.getAttribute('product-id') ?? ''

      setProductId($attr)
    }
  }, [])

  if (!productId) return null

  return (
    <Components.Showcase
      content={{
        ...content,
        products: { type: 'crossSelling' },
      }}
      storeConfig={storeConfig}
      controls={controls}
      selectedFacets={selectedFacets}
      PlatformHooks={PlatformHooks}
      PlatformComponents={PlatformComponents}
    />
  )
}

export default CrossSellingShelf
