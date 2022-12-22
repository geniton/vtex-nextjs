import { gql } from '@faststore/graphql-utils'
import { sendAnalyticsEvent } from '@faststore/sdk'
import { useEffect, useMemo, useState } from 'react'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import cn from 'classnames'
import { Components } from 'src/@ui'
import type { VariationsProps } from '@retailhub/audacity-ui/src/types'

import OutOfStock from 'src/components/product/OutOfStock'
import { DiscountBadge } from 'src/components/ui/Badge'
import Breadcrumb from 'src/components/ui/Breadcrumb'
import { ButtonBuy } from 'src/components/ui/Button'
import { ImageGallery } from 'src/components/ui/ImageGallery'
import Price from 'src/components/ui/Price'
import ProductTitle from 'src/components/ui/ProductTitle'
import QuantitySelector from 'src/components/ui/QuantitySelector'
import ShippingSimulation from 'src/components/ui/ShippingSimulation'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProduct } from 'src/sdk/product/useProduct'
import { useSession } from 'src/sdk/session'
import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'
import type { AnalyticsItem } from 'src/sdk/analytics/types'
import Selectors from 'src/components/ui/SkuSelector'
import storeConfig from 'store.config'

import styles from './product-details.module.scss'
import Section from '../Section'

interface Props {
  product: ProductDetailsFragment_ProductFragment
  controls: {
    general: {
      showProductName: boolean
      showSkuName: boolean
      showProductReference: boolean
      galleryMode: 'with-thumbnails' | 'list' | 'list-with-spaces'
      mobileVariations: VariationsProps
      deskVariations: VariationsProps
    }
  }
}

function ProductDetails({
  product: staleProduct,
  controls: {
    general: {
      showProductName,
      showSkuName,
      showProductReference,
      galleryMode,
      mobileVariations,
      deskVariations,
    },
  },
}: Props) {
  const { currency } = useSession()
  const [addQuantity, setAddQuantity] = useState(1)
  const [sellers, setSellers] = useState<any>(staleProduct.sellers)

  // Stale while revalidate the product for fetching the new price etc
  const { data, isValidating } = useProduct(staleProduct.id, {
    product: staleProduct,
  })

  if (!data) {
    throw new Error('NotFound')
  }

  const {
    product: {
      description,
      id,
      sku,
      gtin,
      name: variantName,
      variations,
      brand,
      isVariantOf,
      isVariantOf: { name: productName, skuVariants },
      image,
      breadcrumbList: breadcrumbs,
      additionalProperty,
      link,
    },
  } = data

  const sellerActive = useMemo(
    () =>
      sellers.filter((seller: any) =>
        sellers.length < 1
          ? (seller.sellerDefault = true)
          : seller.sellerDefault
      )[0],
    [sellers]
  )

  const buyDisabled = useMemo(
    () => !sellerActive.AvailableQuantity,
    [sellerActive]
  )

  if (skuVariants && variations) {
    skuVariants.availableVariations = JSON.parse(variations)
  }

  const buyProps = useBuyButton({
    id,
    price: sellerActive.Price,
    listPrice: sellerActive.ListPrice,
    seller: { identifier: sellerActive.sellerId },
    quantity: addQuantity,
    itemOffered: {
      sku,
      name: variantName,
      gtin,
      image,
      brand,
      isVariantOf,
      additionalProperty,
    },
  })

  function productTitle() {
    const title: string[] = []

    if (showProductName) {
      title.push(productName)
    }

    if (showSkuName) {
      title.push(showProductName ? ` - ${variantName}` : variantName)
    }

    return (
      <ProductTitle
        title={
          <h1> {title.length ? title.join('') : productName || variantName}</h1>
        }
        label={
          <DiscountBadge
            listPrice={sellerActive.ListPrice}
            spotPrice={sellerActive.Price}
            big
          />
        }
        refNumber={showProductReference ? gtin : ''}
      />
    )
  }

  useEffect(() => {
    sendAnalyticsEvent<ViewItemEvent<AnalyticsItem>>({
      name: 'view_item',
      params: {
        currency: currency.code as CurrencyCode,
        value: sellerActive.Price,
        items: [
          {
            item_id: isVariantOf.productGroupID,
            item_name: isVariantOf.name,
            item_brand: brand.name,
            item_variant: sku,
            price: sellerActive.Price,
            discount: sellerActive.ListPrice - sellerActive.Price,
            currency: currency.code as CurrencyCode,
            item_variant_name: variantName,
            product_reference_id: gtin,
          },
        ],
      },
    })
  }, [
    isVariantOf.productGroupID,
    isVariantOf.name,
    brand.name,
    sku,
    sellerActive,
    currency.code,
    variantName,
    gtin,
  ])

  useEffect(() => {
    setSellers(data?.product.sellers)
  }, [data])

  return (
    <Section
      className={`${styles.fsProductDetails} layout__content layout__section`}
      sku-id={sku}
    >
      <Components.Container
        className={cn({
          'mobile-only:p-0': mobileVariations?.full,
          'md:p-0': deskVariations?.full,
        })}
      >
        <Breadcrumb breadcrumbList={breadcrumbs.itemListElement} />

        <section data-fs-product-details-body>
          <ImageGallery
            data-fs-product-details-gallery
            galleryMode={galleryMode}
            images={image}
            skuId={sku}
            productUrl={`${storeConfig.storeUrl}${link}`}
          />

          <section
            data-fs-product-details-info
            data-fs-product-details-sellers-box={sellers.length > 1}
          >
            <header data-fs-product-details-title>{productTitle()}</header>
            {sellers.length >= 2 ? (
              <ul data-fs-product-details-seller-items>
                {sellers.map((seller: any) => (
                  <li data-fs-product-details-seller-item key={seller.sellerId}>
                    <button
                      data-fs-product-details-seller-btn
                      data-fs-product-details-seller-btn-active={
                        seller.sellerDefault
                      }
                      onClick={() => {
                        setSellers(
                          sellers.map((staleSeller: any) => ({
                            ...staleSeller,
                            sellerDefault:
                              seller.sellerId === staleSeller.sellerId,
                          }))
                        )
                      }}
                    >
                      {seller.sellerName}
                      <Price
                        value={seller.Price}
                        formatter={useFormattedPrice}
                        data-value={seller.Price}
                        SRText="Original price:"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <section
              data-fs-product-details-settings
              data-fs-product-details-section
              data-fs-product-details-section-full={sellers.length <= 1}
            >
              <section data-fs-product-details-values>
                <div data-fs-product-details-prices>
                  <Price
                    value={sellerActive.ListPrice}
                    formatter={useFormattedPrice}
                    testId="list-price"
                    data-value={sellerActive.ListPrice}
                    variant="listing"
                    classes="text__legend"
                    SRText="Original price:"
                  />
                  <Price
                    value={sellerActive.Price}
                    formatter={useFormattedPrice}
                    testId="price"
                    data-value={sellerActive.Price}
                    variant="spot"
                    classes="text__lead"
                    SRText="Sale Price:"
                  />
                </div>
                {/* <div className="prices">
                  <p className="price__old text__legend">{formattedListPrice}</p>
                  <p className="price__new">{isValidating ? '' : formattedPrice}</p>
                </div> */}
              </section>
              {skuVariants && (
                <Selectors
                  slugsMap={skuVariants.slugsMap}
                  availableVariations={skuVariants.availableVariations}
                  activeVariations={skuVariants.activeVariations}
                  data-fs-product-details-selectors
                />
              )}
              {sellerActive.AvailableQuantity ? (
                <>
                  {/* NOTE: A loading skeleton had to be used to avoid a Lighthouse's
                  non-composited animation violation due to the button transitioning its
                  background color when changing from its initial disabled to active state.
                  See full explanation on commit https://git.io/JyXV5. */}
                  <div data-fs-product-details-wrapper>
                    <QuantitySelector
                      min={1}
                      max={10}
                      onChange={setAddQuantity}
                    />
                    {isValidating ? (
                      <AddToCartLoadingSkeleton />
                    ) : (
                      <>
                        <ButtonBuy disabled={buyDisabled} {...buyProps}>
                          Adicionar
                        </ButtonBuy>
                        <ButtonBuy
                          disabled={buyDisabled}
                          icon={false}
                          goToCheckout
                          {...buyProps}
                        >
                          Comprar agora
                        </ButtonBuy>
                      </>
                    )}
                  </div>
                  <ShippingSimulation
                    data-fs-product-details-shipping
                    shippingItem={{
                      id,
                      quantity: addQuantity,
                      seller: sellerActive.sellerId,
                    }}
                  />
                </>
              ) : (
                <OutOfStock
                  onSubmit={(email) => {
                    console.info(email)
                  }}
                />
              )}
            </section>
          </section>
        </section>
        <Components.ProductDetailsContent
          description={description}
          specifications={isVariantOf.additionalProperty}
        />
      </Components.Container>
    </Section>
  )
}

function AddToCartLoadingSkeleton() {
  // Generated via https://skeletonreact.com/.
  return (
    <svg
      role="img"
      width="100%"
      height="48"
      aria-labelledby="loading-aria"
      viewBox="0 0 112 48"
      preserveAspectRatio="none"
    >
      <title id="loading-aria">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path)"
        style={{ fill: 'url("#fill")' }}
      />
      <defs>
        <clipPath id="clip-path">
          <rect x="0" y="0" rx="2" ry="2" width="112" height="48" />
        </clipPath>
        <linearGradient id="fill">
          <stop offset="0.599964" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="1.59996" stopColor="#ecebeb" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="2.59996" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export const fragment = gql`
  fragment ProductDetailsFragment_product on StoreProduct {
    id: productID
    sku
    name
    gtin
    description
    link
    variations

    isVariantOf {
      name
      productGroupID
      additionalProperty {
        name
        value
      }
      skuVariants {
        activeVariations
        slugsMap(dominantVariantName: "Cor")
        availableVariations(dominantVariantName: "Cor")
      }
      hasVariant {
        offers {
          offers {
            availability
            quantity
            seller {
              identifier
            }
          }
        }
      }
    }

    image {
      url
      alternateName
    }

    brand {
      name
    }

    offers {
      lowPrice
      offers {
        availability
        price
        listPrice
        seller {
          identifier
        }
      }
    }

    sellers {
      sellerId
      sellerName
      addToCartLink
      sellerDefault
      AvailableQuantity
      Installments {
        Value
        InterestRate
        TotalValuePlusInterestRate
        NumberOfInstallments
        PaymentSystemName
        PaymentSystemGroupName
        Name
      }
      Price
      ListPrice
      discountHighlights {
        name
      }
    }

    breadcrumbList {
      itemListElement {
        item
        name
        position
      }
    }

    # Contains necessary info to add this item to cart
    ...CartProductItem
  }
`

export default ProductDetails
