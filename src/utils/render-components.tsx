import { Components } from '@retailhub/audacity'
import { VtexComponents } from '@retailhub/audacity-vtex'

import variables from 'config/variables.json'
import storeConfig from 'store.config'

import {
  VtexHooks,
  VtexUtils,
  VtexQueries,
  VtexComponents as ModelVtexComponents,
  NextjsComponents,
  NextjsHooks,
} from 'src/utils'

interface Props {
  components: any[]
  [key: string]: any
}

const RenderComponents = ({ components, ...otherProps }: Props): any => {
  const props = {
    storeConfig,
    variables,
    // Vtex
    VtexHooks,
    VtexQueries,
    VtexComponents: ModelVtexComponents,
    VtexUtils,
    // Nextjs
    NextjsComponents,
    NextjsHooks,
    ...otherProps,
  }

  if (!components?.length) {
    return null
  }

  return components.map(({ component, componentData }: any, index: number) => {
    if (component === 'CategoryProducts') {
      component = 'ProductGallery'
    }

    if (component === 'SingleProduct') {
      component = 'ProductDetails'
    }

    let Component: any = Components[component as keyof typeof Components]
    
    if (!Component) {
        Component = VtexComponents[component as keyof typeof VtexComponents]
    }

    return Component ? (
      <Component key={`${component}-${index}`} {...componentData} {...props} />
    ) : null
  })
}

export default RenderComponents