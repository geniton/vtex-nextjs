import type { NextRouter } from 'next/router'

import { arrayMove } from 'src/utils/global'

export type SkuVariantsByName = Record<
  string,
  Array<{ alt: string; src: string; label: string; value: string }>
>

export function getSkuSlug(
  slugsMap: Record<string, string>,
  selectedVariations: Record<string, string>,
  dominantVariation: string
) {
  // change dominant variation to the first position in selectedVariations
  const variantsName = Object.keys(selectedVariations)
  const variantColorIndex: number = variantsName.findIndex(
    (variant: string) => variant === dominantVariation
  )

  if (variantColorIndex !== -1 && variantsName.length > 1) {
    const variations = arrayMove(variantsName, variantColorIndex, 0)
    const newSelectedVariations: any = {}

    for (let index = 0; index < variations.length; index++) {
      const keyName = variations[index]

      newSelectedVariations[keyName] = selectedVariations[keyName]
    }

    selectedVariations = newSelectedVariations
  } else {
    dominantVariation = Object.keys(selectedVariations)[0]
  }

  const slugsMapKey = Object.entries(selectedVariations).flat().join('-')

  if (slugsMapKey in slugsMap) {
    return slugsMap[slugsMapKey]
  }

  const possibleVariants = Object.keys(slugsMap)

  const firstVariationForDominantValue = possibleVariants.find((slug) =>
    slug.includes(
      `${dominantVariation}-${selectedVariations[dominantVariation]}`
    )
  )

  return slugsMap[firstVariationForDominantValue ?? possibleVariants[0]]
}

export function navigateToSku({
  router,
  slugsMap,
  dominantSku,
  selectorsState,
  updatedVariationName,
  updatedVariationValue,
}: {
  router: NextRouter
  dominantSku: string
  slugsMap: Record<string, string>
  selectorsState: Record<string, string>
  updatedVariationName: string
  updatedVariationValue: string
}) {
  const whereTo = `/${getSkuSlug(
    slugsMap,
    {
      ...selectorsState,
      [updatedVariationName]: updatedVariationValue,
    },
    dominantSku
  )}/p`

  console.log('whereTo', whereTo)

  if (whereTo === window.location.pathname) {
    return
  }

  router.push(whereTo)
}
