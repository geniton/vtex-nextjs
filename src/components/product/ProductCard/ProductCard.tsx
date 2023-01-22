import {
  ProductCard as UIProductCard,
  ProductCardActions as UIProductCardActions,
  ProductCardContent as UIProductCardContent,
} from '@faststore/ui'
import { memo, useRef } from 'react'
import type { ReactNode } from 'react'
import type {
  CardControlsProps,
  CarouselControlsProps,
  VariationsProps,
  EffectsProps,
  Style,
} from '@retailhub/audacity-ui/src/types'
import { Components } from '@retailhub/audacity-ui'

import Link from 'src/components/ui/Link'
import { Badge, DiscountBadge } from 'src/components/ui/Badge'
import { Image } from 'src/components/ui/Image'
import Price from 'src/components/ui/Price'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import styles from 'src/components/product/ProductCard/product-card.module.scss'
import { getProductInstallments, getSellerLowPrice } from 'src/utils/product'
import { Hooks as PlatformHooks } from 'src/utils/components/platform'

type Variant = 'wide' | 'default'

export interface ProductCardProps {
  onChangeLike?: any
  product: ProductSummary_ProductFragment
  index: number
  bordered?: boolean
  variant?: Variant
  aspectRatio?: number
  ButtonBuy?: ReactNode
  controls: {
    general: {
      applyMobileCarouselControls: boolean
      cardControls: CardControlsProps
      carouselControls: CarouselControlsProps
      deskVariations: VariationsProps
      effects: EffectsProps
      mobileCarouselControls: CarouselControlsProps
      mobileVariations: VariationsProps
    }
    style: Style
  }
}

function ProductCard({
  onChangeLike,
  product,
  controls: {
    general: {
      cardControls: {
        showCarousel,
        addImagesLimit,
        imagesQuantity,
        showBrandName,
        showPriceOf,
        showInstallments,
        showSellerName,
        showWishlist,
        showBuyButton,
        titleBuyButton,
        buttonUnavailableTitle,
        showUnabailableMessage,
        unavailableMessage,
        applyLinkOnImage,
        arrows,
        dots,
        showDesc,
      },
      effects: {
        exchangeImage,
        hoverZoom,
        hoverOutlineColor,
        hoverWishlist,
        hoverBuyButton,
      },
    },
    style: {
      cardStyle: {
        bgColor,
        textColor,
        wishlistColor,
        productNameColor,
        brandTextColor,
        sellerNameTextColor,
        priceFromColor,
        priceFromFont,
        pricePerColor,
        pricePerFont,
        installmentsColor,
        installmentsFont = 18,
        unavailableTextColor,
        buyBtnTextColor,
        buyBtnBgColor,
        outlineColor,
        outlineWidth,
        borderRadius,
        addShadow,
        textAlign,
      },
    },
  },
  index,
  variant = 'default',
  bordered = false,
  aspectRatio = 1,
  ...otherProps
}: ProductCardProps) {
  const {
    brand: { brandName },
    description,
    sku,
    isVariantOf: { name },
    image: images,
    sellers,
  }: any = product

  const cardRef = useRef<any>(null)

  const sellerActive = getSellerLowPrice(sellers)

  const productInstallments: any = getProductInstallments(sellerActive)
  const linkProps = useProductLink({ product, selectedOffer: 0, index })
  const outOfStock = sellerActive?.AvailableQuantity < 1
  const productImages = [...images]
  const carouselImages = addImagesLimit
    ? productImages.splice(0, imagesQuantity)
    : productImages

  const CardImage = () => {
    const Wrapper = ({ children }: any) =>
      applyLinkOnImage ? (
        <Link {...linkProps} title={name}>
          {children}
        </Link>
      ) : (
        <>{children}</>
      )

    return (
      <Wrapper>
        {showCarousel && images.length > 1 ? (
          <Components.Carousel
            slidesToShow={1}
            slidesToScroll={1}
            arrows={arrows}
            dots={dots}
            infinite
          >
            {carouselImages.map((image: any, imageIndex: number) => (
              <figure
                key={imageIndex}
                className="relative"
                data-fs-product-card-figure
                data-fs-product-card-image-zoom-hover={hoverZoom}
              >
                <Image
                  key={imageIndex}
                  src={image.url}
                  alt={image.alternateName}
                  width={360}
                  height={360 / aspectRatio}
                  sizes="(max-width: 768px) 25vw, 30vw"
                  loading="lazy"
                />
              </figure>
            ))}
          </Components.Carousel>
        ) : (
          <figure
            className="relative"
            data-fs-product-card-figure
            data-fs-product-card-image-zoom-hover={hoverZoom}
          >
            <Image
              src={images[0].url}
              alt={images[0].alternateName}
              width={360}
              height={360 / aspectRatio}
              loading="lazy"
            />
            {exchangeImage && images.length > 1 ? (
              <Image
                src={images[1].url}
                alt={images[1].alternateName}
                width={360}
                height={360 / aspectRatio}
                loading="lazy"
                className="absolute top-0"
                data-fs-product-card-image-exchange={exchangeImage}
              />
            ) : null}
          </figure>
        )}
      </Wrapper>
    )
  }

  const productDesc = () => {
    if (!showDesc || !description) return null

    const formatedDesc = description.replaceAll(/(<([^>]+)>)/gi, '')

    return (
      <span data-fs-product-card-description title={name}>
        {formatedDesc}
      </span>
    )
  }

  return (
    <UIProductCard
      data-fs-product-card
      data-fs-product-card-variant={variant}
      data-fs-product-card-bordered={bordered}
      data-fs-product-card-actionable={showBuyButton}
      data-fs-product-card-sku={sku}
      data-fs-product-card-hover-wishlist={hoverWishlist}
      data-fs-product-card-hover-buy-button={hoverBuyButton}
      className={styles.fsProductCard}
      onMouseEnter={() =>
        (cardRef.current.style.outlineColor = hoverOutlineColor || outlineColor)
      }
      onMouseLeave={() =>
        (cardRef.current.style.outlineColor = outlineColor || 'transparent')
      }
      style={{
        display: showCarousel && images.length > 1 ? 'flex' : 'grid',
        flexDirection: 'column',
        backgroundColor: bgColor,
        color: textColor,
        outlineStyle: 'solid',
        outlineColor,
        outlineWidth: outlineWidth ? `${outlineWidth}px` : '',
        borderRadius: borderRadius ? `${borderRadius}px` : '',
        boxShadow: addShadow ? '0 5px 10px 0 rgba(0,0,0,0.2)' : '',
        textAlign,
      }}
      ref={cardRef}
      {...otherProps}
    >
      {showWishlist && (
        <Components.Like
          skuId={sku}
          onChangeLike={onChangeLike}
          PlatformHooks={PlatformHooks}
          width="17"
          height="17"
          color={wishlistColor}
        />
      )}

      {CardImage()}

      <UIProductCardContent data-fs-product-card-content>
        <div data-fs-product-card-heading>
          <h3 data-fs-product-card-title>
            <Link
              {...linkProps}
              title={name}
              style={{ color: productNameColor }}
            >
              {name}
            </Link>
          </h3>
          {showBrandName && (
            <span data-fs-product-card-brand style={{ color: brandTextColor }}>
              {brandName}
            </span>
          )}
          {showSellerName && (
            <span
              data-fs-product-card-seller-name
              style={{ color: sellerNameTextColor }}
            >
              Vendido por:{' '}
              <strong style={{ color: sellerNameTextColor }}>
                {sellerActive?.sellerName}
              </strong>
            </span>
          )}
          {productDesc()}
          <div data-fs-product-card-prices>
            <Link {...linkProps} title={name}>
              {showPriceOf && sellerActive?.ListPrice > sellerActive?.Price && (
                <Price
                  value={sellerActive?.ListPrice}
                  formatter={useFormattedPrice}
                  testId="list-price"
                  data-value={sellerActive?.ListPrice}
                  variant="listing"
                  classes="text__legend"
                  SRText="Original price:"
                  data-fs-price-from
                  style={{ color: priceFromColor, fontSize: priceFromFont }}
                />
              )}
              <Price
                value={sellerActive?.Price}
                formatter={useFormattedPrice}
                testId="price"
                data-value={sellerActive?.Price}
                variant="spot"
                classes="text__body"
                SRText="Sale Price:"
                style={{ color: pricePerColor, fontSize: `${pricePerFont}px` }}
              />
            </Link>
          </div>
          {showInstallments &&
            productInstallments &&
            productInstallments.NumberOfInstallments > 1 && (
              <span
                data-fs-product-card-installments
                style={{
                  color: installmentsColor,
                  fontSize: installmentsFont,
                }}
              >
                Até{' '}
                <strong>{`${productInstallments.NumberOfInstallments}x`}</strong>{' '}
                de{' '}
                <strong>
                  <Price
                    value={productInstallments.Value}
                    formatter={useFormattedPrice}
                    testId="list-price"
                    data-value={productInstallments.Value}
                    variant="listing"
                    classes="text__legend"
                    SRText="Maximum installment Price:"
                    data-fs-price-from
                    style={{
                      fontSize: `${installmentsFont}px`,
                    }}
                  />
                </strong>
              </span>
            )}
          {outOfStock ? (
            showUnabailableMessage && (
              <Badge style={{ color: unavailableTextColor }}>
                {unavailableMessage}
              </Badge>
            )
          ) : (
            <DiscountBadge
              listPrice={sellerActive?.ListPrice}
              spotPrice={sellerActive?.Price}
            />
          )}
        </div>

        {showBuyButton && (
          <Link {...linkProps} title={name}>
            <UIProductCardActions
              data-fs-product-card-actions
              style={{ backgroundColor: buyBtnBgColor, color: buyBtnTextColor }}
            >
              {outOfStock
                ? buttonUnavailableTitle || titleBuyButton
                : titleBuyButton}
            </UIProductCardActions>
          </Link>
        )}
      </UIProductCardContent>
    </UIProductCard>
  )
}

export default memo(ProductCard)
