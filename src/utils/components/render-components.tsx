import React from 'react'
import { Components } from 'src/@ui'

import variables from 'config/variables.json'
import storeConfig from 'store.config'
import {
  Components as PlatformComponents,
  Hooks as PlatformHooks,
} from 'src/utils/components/platform'

const RenderComponents: React.FC<any> = ({ pageData, ...otherProps }) => {
  const props = {
    storeConfig,
    variables,
    PlatformComponents,
    PlatformHooks,
    ...otherProps,
  }

  return pageData.map(({ component, componentData, id }: any) => {
    if (component === 'CategoryProducts') {
      component = 'ProductGallery'
    }

    if (component === 'SingleProduct') {
      component = 'ProductDetails'
    }

    const Component: any = Components[component as keyof typeof Components]

    return Component ? (
      <Component key={id} {...componentData} {...props} />
    ) : null
  })
}

export default RenderComponents
