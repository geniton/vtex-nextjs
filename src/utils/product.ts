export function findSkuVariantImage(availableImages: any) {
  let _availableImages$find

  return (_availableImages$find = availableImages.find(
    (imageProperties: any) => imageProperties.imageLabel === 'skuvariation'
  )) != null
    ? _availableImages$find
    : availableImages[0]
}

export function compare(a: any, b: any) {
  // Values are always represented as Strings, so we need to handle numbers
  // in this special case.
  if (!Number.isNaN(Number(a) - Number(b))) {
    return Number(a) - Number(b)
  }

  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}

export function sortVariants(variantsByName: any) {
  const sortedVariants = variantsByName

  for (const variantProperty in variantsByName) {
    variantsByName[variantProperty].sort((a: any, b: any) =>
      compare(a.value, b.value)
    )
  }

  return sortedVariants
}

export function checkSellersStock(sellers: any) {
  let outStock = true

  for (let i = 0; i < sellers.length; i++) {
    if (sellers[i].commertialOffer?.AvailableQuantity > 0) {
      outStock = false
    }
  }

  return outStock
}

export function getFormattedVariations(
  variants: any,
  dominantVariantName: any,
  dominantVariantValue: any
) {
  /**
   * SKU options already formatted and indexed by their property name.
   *
   * Ex: {
   *   `Size`: [
   *     { label: '42', value: '42' },
   *     { label: '41', value: '41' },
   *     { label: '39', value: '39' },
   *   ]
   * }
   */
  const variantsByName: any = {}
  const previouslySeenPropertyValues = new Set()

  variants.forEach((variant: any) => {
    if (variant.variations.length === 0) {
      return
    }

    const outStock = checkSellersStock(variant.sellers)

    const variantImageToUse = findSkuVariantImage(variant.images)
    const dominantVariantEntry = variant.variations.find(
      (variation: any) => variation.name === dominantVariantName
    )

    const matchesDominantVariant =
      (dominantVariantEntry == null
        ? undefined
        : dominantVariantEntry.values[0]) === dominantVariantValue

    if (!matchesDominantVariant) {
      let _variantImageToUse$im

      const nameValueIdentifier = `${dominantVariantName}-${
        dominantVariantEntry == null
          ? undefined
          : dominantVariantEntry.values[0]
      }`

      if (
        !dominantVariantEntry ||
        previouslySeenPropertyValues.has(nameValueIdentifier)
      ) {
        return
      }

      previouslySeenPropertyValues.add(nameValueIdentifier)
      const formattedVariant = {
        src: variantImageToUse.imageUrl,
        alt:
          (_variantImageToUse$im = variantImageToUse.imageLabel) != null
            ? _variantImageToUse$im
            : '',
        label: `${dominantVariantName}: ${dominantVariantEntry.values[0]}`,
        value: dominantVariantEntry.values[0],
        disabled: outStock,
      }

      if (variantsByName[dominantVariantEntry.name]) {
        variantsByName[dominantVariantEntry.name].push(formattedVariant)
      } else {
        variantsByName[dominantVariantEntry.name] = [formattedVariant]
      }

      return
    }

    variant.variations.forEach((variationProperty: any) => {
      let _variantImageToUse$im2

      const nameValueIdentifier = `${variationProperty.name}-${variationProperty.values[0]}`

      if (previouslySeenPropertyValues.has(nameValueIdentifier)) {
        return
      }

      previouslySeenPropertyValues.add(nameValueIdentifier)
      const formattedVariant = {
        src: variantImageToUse.imageUrl,
        alt:
          (_variantImageToUse$im2 = variantImageToUse.imageLabel) != null
            ? _variantImageToUse$im2
            : '',
        label: `${variationProperty.name}: ${variationProperty.values[0]}`,
        value: variationProperty.values[0],
        disabled: outStock,
      }

      if (variantsByName[variationProperty.name]) {
        variantsByName[variationProperty.name].push(formattedVariant)
      } else {
        variantsByName[variationProperty.name] = [formattedVariant]
      }
    })
  })

  return sortVariants(variantsByName)
}

export function getActiveSkuVariations(variations: any) {
  const activeVariations: any = {}

  variations.forEach((variation: any) => {
    activeVariations[variation.name] = variation.values[0]
  })

  return activeVariations
}

export function getProductInstallments(sellerActive: any) {
  let productInstallments = null

  if (!sellerActive?.Installments?.length) {
    return
  }

  const installmentObj: any = sellerActive.Installments.sort(
    (a: any, b: any) => {
      return a.Value - b.Value
    }
  )[0]

  const installmentIndex: any = sellerActive.Installments.map(
    (installment: any, index: number) => {
      return installment === installmentObj ? index : ''
    }
  ).filter(String)[0]

  if (sellerActive.Installments[installmentIndex].NumberOfInstallments > 1) {
    const installments = sellerActive.Installments[installmentIndex]

    productInstallments = installments
  }

  return productInstallments
}

export function getSellerLowPrice(sellers: any) {
  let bestSeller: any = null

  if (!sellers?.length) return

  for (let i = 0; i < sellers?.length; i++) {
    const sellerMutable = sellers[i]

    if (
      !bestSeller ||
      (sellerMutable.AvailableQuantity &&
        sellerMutable.Price < bestSeller.Price) ||
      (!bestSeller.AvailableQuantity && sellerMutable.AvailableQuantity)
    ) {
      bestSeller = {
        ...sellerMutable,
      }
    }
  }

  return bestSeller
}
