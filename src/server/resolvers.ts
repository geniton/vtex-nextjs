import { DOMINANT_SKU_SELECTOR_PROPERTY } from 'src/components/ui/SkuSelector/Selectors'
import {
  attachmentToPropertyValue,
  createSlugsMap,
  getActiveSkuVariations,
  getFormattedVariations,
  getVariantsByName,
  VALUE_REFERENCES,
} from 'src/utils/product'

const resolvers = {
  StoreProduct: {
    data: (root: any) => {
      const activeVariations: any = getActiveSkuVariations(root.variations)
      const activeDominantVariationValue =
        activeVariations[DOMINANT_SKU_SELECTOR_PROPERTY]

      const filteredFormattedVariations = getFormattedVariations(
        root.isVariantOf.items,
        DOMINANT_SKU_SELECTOR_PROPERTY,
        activeDominantVariationValue
      )

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
      })
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
    additionalProperty: ({
      // Search uses the name variations for specifications
      variations: specifications = [],
      attachmentsValues = [],
    }) => {
      const propertyValueSpecifications = specifications.flatMap(
        ({ name, values }: any) =>
          values.map((value: any) => ({
            name,
            value,
            valueReference: VALUE_REFERENCES.specification,
          }))
      )

      const propertyValueAttachments = attachmentsValues.map(
        attachmentToPropertyValue
      )

      return [...propertyValueSpecifications, ...propertyValueAttachments]
    },
  },
}

export default resolvers
