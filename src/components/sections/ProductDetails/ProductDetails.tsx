import { gql } from '@faststore/graphql-utils'
import { sendAnalyticsEvent } from '@faststore/sdk'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import cn from 'classnames'
import type { SingleProductControls } from '@retailhub/audacity-ui/src/components/single-product/types'
import { Components, Utils } from '@retailhub/audacity-ui'
import Image from 'next/future/image'

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
import CardIcon from 'src/images/card.png'

import styles from './product-details.module.scss'
import Section from '../Section'

interface Props {
  product: ProductDetailsFragment_ProductFragment
  controls: SingleProductControls
}

function getSpecificationHTML(data: any[]) {
  return `
  <table class="w-full" style="width:100%;">
    ${data
      .map(
        (specificationItem: any, key: number) => `
      <tr
        key=${key}
        style=${key % 2 ? 'background-color:#f1f2f3;' : ''}
      >
        <th class='text-left py-3 pl-4 font-normal'>
          ${specificationItem.name}
        </th>
        <td class="text-right py-3 pr-4">${specificationItem.value}</td>
      </tr>
    `
      )
      .join('')}
  </table>
`
}

function ProductDetails({
  product: staleProduct,
  controls: {
    general: {
      showProductName,
      showSkuName,
      showProductReference,
      buyNowBtn,
      buyNowBtnText,
      addProductInformationBelowBuybox,
      mobileVariations,
      deskVariations,
      galleryWithCarousel,
      galleryWithThumbnails,
      galleryImagesPerView,
      galleryThumbnailsPosition,
    },
    effects,
    style,
  },
}: Props) {
  const { currency } = useSession()
  const [addQuantity, setAddQuantity] = useState(1)
  const [sellers, setSellers] = useState<any>(staleProduct.sellers)
  const [installmentsModal, setInstallmentsModal] = useState(false)
  const buyButtonReference = useRef<HTMLButtonElement>(null)
  const buyNowButtonReference = useRef<HTMLButtonElement>(null)

  const {
    priceFromFontSize,
    priceFromColor,
    pricePerFontSize,
    pricePerColor,
    buyButtonTextColor,
    buyButtonBgColor,
    buyButtonCornerRounding,
    buyButtonBorderWidth,
    buyButtonBorderColor,
    buyNowButtonTextColor,
    buyNowButtonBgColor,
    buyNowButtonBorderWidth,
    buyNowButtonBorderColor,
    buyNowButtonCornerRounding,
  } = style ?? {}

  const {
    hoverBuyButtonBgColor,
    hoverBuyButtonTextColor,
    hoverBuyButtonBorderColor,
    hoverBuyNowButtonBgColor,
    hoverBuyNowButtonTextColor,
    hoverBuyNowButtonBorderColor,
  } = effects ?? {}

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

  const { margins, paddings } = style ?? {}

  const sellerActive = useMemo(
    () =>
      sellers.filter((seller: any) =>
        sellers.length <= 1
          ? (seller.sellerDefault = true)
          : seller.sellerDefault
      )[0],
    [sellers]
  )

  const buyDisabled = useMemo(
    () => !sellerActive.AvailableQuantity,
    [sellerActive]
  )

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

  const installments = useMemo(
    () => Utils?.Vtex?.Product?.getProductInstallments(sellerActive),
    [sellerActive]
  )

  const installmentPrices = useMemo(
    () => Utils?.Vtex?.Product?.getInstallmentPrices(sellerActive),
    []
  )

  function handleHoverButton(action: string, buttonName: string) {
    const buyButton = buyButtonReference.current as HTMLElement
    const buyNowButton = buyNowButtonReference.current as HTMLElement

    if (action === 'enter') {
      if (buttonName === 'buyButton') {
        buyButton.style.backgroundColor =
          hoverBuyButtonBgColor || buyButtonBgColor || ''
        buyButton.style.color =
          hoverBuyButtonTextColor || buyButtonTextColor || ''
        buyButton.style.borderColor =
          hoverBuyButtonBorderColor || buyButtonBorderColor || ''
      } else if (buttonName === 'buyNowButton') {
        buyNowButton.style.backgroundColor =
          hoverBuyNowButtonBgColor || buyNowButtonBgColor || ''
        buyNowButton.style.color = hoverBuyNowButtonTextColor || buyNowButtonTextColor ||  ''
        buyNowButton.style.borderColor =
          hoverBuyNowButtonBorderColor || buyNowButtonBorderColor || ''
      }
    } else if (action === 'leave') {
      if (buttonName === 'buyButton') {
        buyButton.style.backgroundColor = buyButtonBgColor || ''
        buyButton.style.color = buyButtonTextColor || ''
        buyButton.style.borderColor = buyButtonBorderColor || ''
      } else if (buttonName === 'buyNowButton') {
        buyNowButton.style.backgroundColor = buyNowButtonBgColor || ''
        buyNowButton.style.color = buyNowButtonTextColor || ''
        buyNowButton.style.borderColor = buyNowButtonBorderColor || ''
      }
    }
  }

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

  if (skuVariants && variations) {
    skuVariants.availableVariations = JSON.parse(variations)
  }

  return (
    <Section
      id="product-page"
      className={`${styles.fsProductDetails} layout__content layout__section`}
      product-id={isVariantOf.productGroupID}
      sku-id={sku}
      style={{
        margin: margins
          ? `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
          : '',
        padding: paddings
          ? `${paddings.top}px ${paddings.right}px ${paddings.bottom}px ${paddings.left}px`
          : '',
      }}
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
            withCarousel={galleryWithCarousel}
            imagesPerView={galleryImagesPerView}
            thumbnailsPosition={galleryThumbnailsPosition}
            withThumbnails={galleryWithThumbnails}
            images={image}
            skuId={sku}
            productUrl={`${storeConfig.storeUrl}${link}`}
          />

          <section data-fs-product-details-info>
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
              {skuVariants && (
                <Selectors
                  slugsMap={skuVariants.slugsMap}
                  availableVariations={skuVariants.availableVariations}
                  activeVariations={skuVariants.activeVariations}
                  data-fs-product-details-selectors
                />
              )}
              <section data-fs-product-details-values>
                <div data-fs-product-details-prices>
                  {sellerActive.ListPrice > sellerActive.Price && (
                    <Price
                      value={sellerActive.ListPrice}
                      formatter={useFormattedPrice}
                      testId="list-price"
                      data-value={sellerActive.ListPrice}
                      variant="listing"
                      classes="text__legend"
                      SRText="Original price:"
                      style={{
                        fontSize: priceFromFontSize ? `${priceFromFontSize}px` : '',
                        color: priceFromColor,
                      }}
                    />
                  )}
                  <Price
                    value={sellerActive.Price}
                    formatter={useFormattedPrice}
                    testId="price"
                    data-value={sellerActive.Price}
                    variant="spot"
                    classes="text__lead"
                    SRText="Sale Price:"
                    style={{
                      fontSize: pricePerFontSize ? `${pricePerFontSize}px` : '',
                      color: pricePerColor,
                    }}
                  />
                </div>
                {/* <div className="prices">
                  <p className="price__old text__legend">{formattedListPrice}</p>
                  <p className="price__new">{isValidating ? '' : formattedPrice}</p>
                </div> */}
              </section>
              {installments?.NumberOfInstallments > 1 && (
                <div data-fs-product-details-installments>
                  <Image src={CardIcon} width={20} height={20} alt="card" />
                  <div data-fs-product-details-installments-content>
                    <span>
                      ou{' '}
                      {`${Utils.Formats?.formatPrice(
                        installments.TotalValuePlusInterestRate
                      )}`}{' '}
                      em até{' '}
                      <strong>{`${installments.NumberOfInstallments}x`}</strong>{' '}
                      de{' '}
                      <strong>
                        {Utils.Formats?.formatPrice(installments?.Value)}
                      </strong>{' '}
                      {installments.InterestRate === 0 && '(sem juros)'}
                    </span>
                    <button
                      data-fs-product-details-methods-btn
                      onClick={() => setInstallmentsModal(true)}
                    >
                      Mais formas de pagamento
                    </button>
                  </div>
                </div>
              )}

              <Components.Shared.InstallmentsModal
                isOpen={installmentsModal}
                installmentPrices={installmentPrices}
                onClose={() => setInstallmentsModal(false)}
              />

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
                    <div data-fs-product-details-buttons-wrapper>
                      {isValidating ? (
                        <AddToCartLoadingSkeleton />
                      ) : (
                        <>
                          <ButtonBuy 
                            disabled={buyDisabled}
                            style={{
                              backgroundColor: buyButtonBgColor,
                              color: buyButtonTextColor,
                              borderWidth: buyButtonBorderWidth
                              ? `${buyButtonBorderWidth}px`
                              : '',
                              borderColor: buyButtonBorderColor,
                              borderRadius: buyButtonCornerRounding
                              ? `${buyButtonCornerRounding.top}px ${buyButtonCornerRounding.right}px ${buyButtonCornerRounding.bottom}px ${buyButtonCornerRounding.left}px`
                              : '',
                            }} 
                            {...buyProps}
                            onMouseEnter={() => handleHoverButton('enter', 'buyButton')}
                            onMouseLeave={() => handleHoverButton('leave', 'buyButton')}
                            ref={buyButtonReference}
                          >
                            Adicionar
                          </ButtonBuy>
                          {buyNowBtn && (
                            <ButtonBuy
                              disabled={buyDisabled}
                              icon={false}
                              goToCheckout
                              style={{
                                backgroundColor: buyNowButtonBgColor,
                                color: buyNowButtonTextColor,
                                borderWidth: buyNowButtonBorderWidth
                                  ? `${buyNowButtonBorderWidth}px`
                                  : '',
                                borderColor: buyNowButtonBorderColor,
                                borderRadius: buyNowButtonCornerRounding
                                  ? `${buyNowButtonCornerRounding.top}px ${buyNowButtonCornerRounding.right}px ${buyNowButtonCornerRounding.bottom}px ${buyNowButtonCornerRounding.left}px`
                                  : '',
                              }}
                              onMouseEnter={() =>
                                handleHoverButton('enter', 'buyNowButton')
                              }
                              onMouseLeave={() =>
                                handleHoverButton('leave', 'buyNowButton')
                              }
                              ref={buyNowButtonReference}
                              {...buyProps}
                            >
                              {buyNowBtnText ?? 'Comprar agora' }
                            </ButtonBuy>
                          )}
                        </>
                      )}
                    </div>
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
              {addProductInformationBelowBuybox && (
                <>
                  <Components.AccordionItem
                    showIcon
                    title="Detalhes do produto"
                    content={description}
                  />
                  {isVariantOf.additionalProperty?.length ? (
                    <Components.AccordionItem
                      title="Especificações Técnicas"
                      showIcon
                      content={getSpecificationHTML(
                        isVariantOf.additionalProperty
                      )}
                    />
                  ) : null}
                </>
              )}
            </section>
          </section>
        </section>
        {!addProductInformationBelowBuybox && (
          <Components.ProductDetailsContent
            description={description}
            specifications={isVariantOf.additionalProperty}
          />
        )}
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
