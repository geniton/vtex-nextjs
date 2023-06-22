import { sendAnalyticsEvent } from '@faststore/sdk'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import cn from 'classnames'
import { Components, Utils } from '@retailhub/audacity'
import { VtexComponents, VtexUtils } from '@retailhub/audacity-vtex'
import type { SingleProductControls } from '@retailhub/audacity-vtex/src/components/single-product/model'
import Link from 'next/link'
import Image from 'next/image'

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
import { useSession } from 'src/sdk/session'
import type { AnalyticsItem } from 'src/sdk/analytics/types'
import Selectors from 'src/components/ui/SkuSelector'
import storeConfig from 'store.config'

import styles from './product-details.module.scss'
import Section from '../Section'

interface Props {
  product: any
  skuId: string
  controls: SingleProductControls
}

function renderSpecifications(data: any[]) {
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
  product,
  controls: {
    general: {
      showProductName,
      showSkuName,
      showProductReference,
      buyNowBtn,
      buyNowBtnText,
      addProductInformationBelowBuybox,
      showSimilarProducts,
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
  const [installmentsModal, setInstallmentsModal] = useState(false)
  const buyButtonReference = useRef<HTMLButtonElement>(null)
  const buyNowButtonReference = useRef<HTMLButtonElement>(null)
  const [sellers, setSellers] = useState<any>(product?.sellers)
  const [similarProducts, setSimilarProducts] = useState([])
  const [installments, setInstallments] = useState<any>()

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
  // const { data, isValidating } = useProduct(staleProductstaleProduct.productId)
  const isValidating = false

  if (!product) {
    throw new Error('NotFound')
  }

  const {
    itemId,
    gtin,
    variantName,
    brand,
    images,
    breadcrumbs,
    additionalProperty,
    link,
    skuVariants,
    description,
    productName,
    productId,
  } = product

  const { margins, paddings } = style ?? {}

  const sellerActive = useMemo(
    () =>
      sellers.find((seller: any) =>
        sellers.length <= 1
          ? (seller.sellerDefault = true)
          : seller.sellerDefault
      ),
    [sellers]
  )

  const buyDisabled = useMemo(
    () => !sellerActive.commertialOffer.AvailableQuantity,
    [sellerActive]
  )

  const buyProps = useBuyButton({
    id: itemId,
    price: sellerActive.commertialOffer.Price,
    listPrice: sellerActive.commertialOffer.ListPrice,
    seller: { identifier: sellerActive.sellerId },
    quantity: addQuantity,
    itemOffered: {
      sku: itemId,
      name: variantName,
      gtin,
      image: images,
      brand,
      isVariantOf: {
        productGroupID: productId,
        name: productName,
      },
      additionalProperty,
    },
  })

  const installmentPrices = useMemo(
    () => VtexUtils.Product?.getInstallmentPrices(sellerActive.commertialOffer),
    [sellerActive]
  )

  function renderSimilarProducts() {
    if (!similarProducts?.length) return <></>

    return (
      <section className={styles.fsProductSimilars}>
        <span>Produtos Similares</span>
        <ul>
          {similarProducts.map(({ items, linkText }: any) => (
            <li key={`/${linkText}-${items[0].itemId}/p`}>
              <Link href={`/${linkText}-${items[0].itemId}/p`}>
                <Image
                  alt={items[0].nameComplete}
                  width={42}
                  height={34}
                  src={items?.[0]?.images?.[0]?.imageUrl}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )
  }

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
        buyNowButton.style.color =
          hoverBuyNowButtonTextColor || buyNowButtonTextColor || ''
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
            listPrice={sellerActive.commertialOffer.ListPrice}
            spotPrice={sellerActive.commertialOffer.Price}
            big
          />
        }
        refNumber={showProductReference ? gtin : ''}
      />
    )
  }

  async function getsimilarProducts() {
    try {
      const { data } = await fetch(
        `/api/similar-products?id=${productId}`
      ).then((response) => response.json())

      setSimilarProducts(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    sendAnalyticsEvent<ViewItemEvent<AnalyticsItem>>({
      name: 'view_item',
      params: {
        currency: currency.code as CurrencyCode,
        value: sellerActive.commertialOffer.Price,
        items: [
          {
            item_id: productId,
            item_name: productName,
            item_brand: brand.name,
            item_variant: itemId,
            price: sellerActive.commertialOffer.Price,
            discount:
              sellerActive.commertialOffer.ListPrice -
              sellerActive.commertialOffer.Price,
            currency: currency.code as CurrencyCode,
            item_variant_name: variantName,
            product_reference_id: gtin,
          },
        ],
      },
    })
  }, [brand.name, itemId, sellerActive, currency.code, variantName, gtin])

  useEffect(() => {
    setSellers(product.sellers)
  }, [product])

  useEffect(() => {
    setInstallments(
      VtexUtils.Product?.getProductInstallments(sellerActive.commertialOffer)
    )
  }, [sellerActive])

  useEffect(() => {
    getsimilarProducts()
  }, [])

  if (!sellerActive) return null

  return (
    <Section
      id="product-page"
      className={`${styles.fsProductDetails} layout__content layout__section`}
      product-id={productId}
      sku-id={itemId}
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
            images={images}
            skuId={itemId}
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
              {showSimilarProducts && renderSimilarProducts()}
              <section data-fs-product-details-values>
                <div data-fs-product-details-prices>
                  {sellerActive.commertialOffer.ListPrice >
                    sellerActive.commertialOffer.Price && (
                    <Price
                      value={sellerActive.commertialOffer.ListPrice}
                      formatter={useFormattedPrice}
                      testId="list-price"
                      data-value={sellerActive.commertialOffer.ListPrice}
                      variant="listing"
                      classes="text__legend"
                      SRText="Original price:"
                      style={{
                        fontSize: priceFromFontSize
                          ? `${priceFromFontSize}px`
                          : '',
                        color: priceFromColor,
                      }}
                    />
                  )}
                  <Price
                    value={sellerActive.commertialOffer.Price}
                    formatter={useFormattedPrice}
                    testId="price"
                    data-value={sellerActive.commertialOffer.Price}
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
                  <svg
                    fill="#89532f"
                    version="1.1"
                    width={20}
                    height={20}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    enableBackground="new 0 0 24 24"
                  >
                    <g>
                      <g>
                        <g>
                          <path d="M23,20H1c-0.6,0-1-0.4-1-1V5c0-0.6,0.4-1,1-1h22c0.6,0,1,0.4,1,1v14C24,19.6,23.6,20,23,20z M2,18h20V6H2V18z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M23,10H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,10,23,10z" />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path d="M23,12H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,12,23,12z" />
                        </g>
                      </g>
                    </g>
                  </svg>
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

              {installmentPrices?.length ? (
                <VtexComponents.InstallmentsModal
                  isOpen={installmentsModal}
                  installmentPrices={installmentPrices}
                  onClose={() => setInstallmentsModal(false)}
                />
              ) : null}

              {sellerActive.commertialOffer.AvailableQuantity ? (
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
                            onMouseEnter={() =>
                              handleHoverButton('enter', 'buyButton')
                            }
                            onMouseLeave={() =>
                              handleHoverButton('leave', 'buyButton')
                            }
                            ref={buyButtonReference}
                          >
                            Adicionar
                          </ButtonBuy>
                          {buyNowBtn && (
                            <ButtonBuy
                              data-fs-button-variant="buy-now"
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
                              {buyNowBtnText ?? 'Comprar agora'}
                            </ButtonBuy>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <ShippingSimulation
                    data-fs-product-details-shipping
                    shippingItem={{
                      id: itemId,
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
                  {additionalProperty?.length ? (
                    <Components.AccordionItem
                      title="Especificações Técnicas"
                      showIcon
                      content={renderSpecifications(additionalProperty)}
                    />
                  ) : null}
                </>
              )}
            </section>
          </section>
        </section>
        {!addProductInformationBelowBuybox && (
          <VtexComponents.SingleProductContent
            description={description}
            specifications={additionalProperty}
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

export default ProductDetails
