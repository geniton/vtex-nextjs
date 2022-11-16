import React from 'react'
import { Components } from '@retailhub/audacity-ui'

import variables from 'config/variables.json'
import storeConfig from 'store.config'
import renderPlatformComponent from 'src/utils/components/render-platform-component'

const RenderComponents: React.FC<any> = ({ pageData, ...otherProps }) => {
  const props = {
    storeConfig,
    variables,
    renderPlatformComponent,
    ...otherProps,
  }

  return pageData.map(({ componentName, componentProps, id }: any) => {
    const Component: any = Components[componentName as keyof typeof Components]

    return Component ? (
      <Component key={id} {...componentProps} {...props} />
    ) : null
  })
}

export default RenderComponents
