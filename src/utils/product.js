export function findSkuVariantImage(availableImages) {
  let _availableImages$find

  return (_availableImages$find = availableImages.find(
    (imageProperties) => imageProperties.imageLabel === 'skuvariation'
  )) != null
    ? _availableImages$find
    : availableImages[0]
}

export function compare(a, b) {
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

export function sortVariants(variantsByName) {
  const sortedVariants = variantsByName

  for (const variantProperty in variantsByName) {
    variantsByName[variantProperty].sort((a, b) =>
      compare(a.value, b.value)
    )
  }

  return sortedVariants
}

export function checkSellersStock(sellers) {
  let outStock = true

  for (let i = 0; i < sellers.length; i++) {
    if (sellers[i].commertialOffer?.AvailableQuantity > 0) {
      outStock = false
    }
  }

  return outStock
}

export function getFormattedVariations(
  variants,
  dominantVariantName,
  dominantVariantValue
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
  const variantsByName = {}
  const previouslySeenPropertyValues = new Set()

  variants.forEach((variant) => {
    if (variant.variations.length === 0) {
      return
    }

    const outStock = checkSellersStock(variant.sellers)

    const variantImageToUse = findSkuVariantImage(variant.images)
    const dominantVariantEntry = variant.variations.find(
      (variation) => variation.name === dominantVariantName
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

    variant.variations.forEach((variationProperty) => {
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

export function getActiveSkuVariations(variations) {
  const activeVariations = {}

  variations.forEach((variation) => {
    activeVariations[variation.name] = variation.values[0]
  })

  return activeVariations
}

export function getProductInstallments(sellerActive) {
  let productInstallments = null

  if (!sellerActive?.Installments?.length) {
    return
  }

  const installmentObj = sellerActive.Installments.sort(
    (a, b) => {
      return a.Value - b.Value
    }
  )[0]

  const installmentIndex = sellerActive.Installments.map(
    (installment, index) => {
      return installment === installmentObj ? index : ''
    }
  ).filter(String)[0]

  if (sellerActive.Installments[installmentIndex].NumberOfInstallments > 1) {
    const installments = sellerActive.Installments[installmentIndex]

    productInstallments = installments
  }

  return productInstallments
}

export function getSellerLowPrice(sellers) {
  let bestSeller = null

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

export function getVariantsByName(skuSpecifications) {
  const variants = {};
  skuSpecifications == null ? undefined : skuSpecifications.forEach((specification) => {
    var _specification$field$;

    variants[(_specification$field$ = specification.field.originalName) != null ? _specification$field$ : specification.field.name] = specification.values.map((value) => {
      var _value$originalName;

      return (_value$originalName = value.originalName) != null ? _value$originalName : value.name;
    });
  });
  return variants;
}

export function createSlugsMap(variants, dominantVariantName, baseSlug) {
  /**
   * Maps property value combinations to their respective SKU's slug. Enables
   * us to retrieve the slug for the SKU that matches the currently selected
   * variations in O(1) time.
   *
   * Example: `'Color-Red-Size-40': 'classic-shoes-37'`
   */
  const slugsMap = {};
  variants.forEach((variant) => {
    var _skuSpecificationProp, _skuSpecificationProp2;

    const skuSpecificationProperties = variant.variations;

    if (skuSpecificationProperties.length === 0) {
      return;
    } // Make sure that the 'name-value' pair for the dominant variation
    // is always the first one.


    const dominantNameValue = `${dominantVariantName}-${(_skuSpecificationProp = (_skuSpecificationProp2 = skuSpecificationProperties.find((variationDetails) => variationDetails.name === dominantVariantName)) == null ? undefined : _skuSpecificationProp2.values[0]) != null ? _skuSpecificationProp : ''}`;
    const skuVariantKey = skuSpecificationProperties.reduce((acc, property) => {
      const shouldIgnore = property.name === dominantVariantName;

      if (shouldIgnore) {
        return acc;
      }

      return acc + `-${property.name}-${property.values[0]}`;
    }, dominantNameValue);
    slugsMap[skuVariantKey] = `${baseSlug}-${variant.itemId}`;
  });
  return slugsMap;
}