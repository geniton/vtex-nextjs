import { DOMINANT_SKU_SELECTOR_PROPERTY } from 'src/components/ui/SkuSelector/Selectors'

import {
  createSlugsMap,
  getActiveSkuVariations,
  getFormattedVariations,
  getVariantsByName,
} from 'src/utils/product'

const resolvers = {
  StoreProduct: {
    data: (root: any) => {
      const activeVariations: any = getActiveSkuVariations(root.variations);
      const activeDominantVariationValue =
        activeVariations[DOMINANT_SKU_SELECTOR_PROPERTY];

      const filteredFormattedVariations = getFormattedVariations(
        root.isVariantOf.items,
        DOMINANT_SKU_SELECTOR_PROPERTY,
        activeDominantVariationValue
      );

      return JSON.stringify({
        ...root,
        skuVariants: {
          allVariantsByName: () =>
            getVariantsByName(root.isVariantOf.skuSpecifications),
          slugsMap: () =>
            createSlugsMap(
              root.isVariantOf.items,
              DOMINANT_SKU_SELECTOR_PROPERTY,
              root.isVariantOf.linkText
            ),
          activeVariations: filteredFormattedVariations,
        },
      });
    },
    sellers: (root: any) => {
      return root.sellers.map(({ commertialOffer, ...otherProps }: any) => ({
        ...commertialOffer,
        ...otherProps,
      }))
    },
    link: (root: any) => root.isVariantOf.link,
    variations: (root: any) => {
      const activeVariations: any = getActiveSkuVariations(root.variations)
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
