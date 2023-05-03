import { useEffect, useMemo, useState } from 'react'
import { VtexComponents } from '@retailhub/audacity-vtex'
import type {
  ShowcaseContent,
  ShowcaseControls,
} from '@retailhub/audacity-vtex/src/components/showcase/model'

import {
  VtexHooks,
  NextjsComponents
} from 'src/utils'
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
    <VtexComponents.Showcase
      content={{
        ...content,
        products: { type: 'crossSelling' },
      }}
      storeConfig={storeConfig}
      controls={controls}
      selectedFacets={selectedFacets}
      VtexHooks={VtexHooks}
      NextjsComponents={NextjsComponents}
    />
  )
}

export default CrossSellingShelf
