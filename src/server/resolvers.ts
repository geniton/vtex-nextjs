import { DOMINANT_SKU_SELECTOR_PROPERTY } from 'src/components/ui/SkuSelector/Selectors'

import {
  getActiveSkuVariations,
  getFormattedVariations,
} from '../utils/product'

const resolvers = {
  StoreProduct: {
    sellers: (root: any) => {
      return root.sellers.map(({ commertialOffer, ...otherProps }: any) => ({
        ...commertialOffer,
        ...otherProps,
      }))
    },
    link: (root: any) => root.isVariantOf.link,
    variations: (root: any) => {
      const activeVariations = getActiveSkuVariations(root.variations)
      const activeDominantVariationValue =
        activeVariations[DOMINANT_SKU_SELECTOR_PROPERTY]

      const filteredFormattedVariations = getFormattedVariations(
        root.isVariantOf.items,
        DOMINANT_SKU_SELECTOR_PROPERTY,
        activeDominantVariationValue
      )

      return JSON.stringify(filteredFormattedVariations)
    },
  },
}

export default resolvers
