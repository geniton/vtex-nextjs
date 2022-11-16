import {
  ProductCard as UIProductCard,
  ProductCardActions as UIProductCardActions,
  ProductCardContent as UIProductCardContent,
} from '@faststore/ui'
import { gql } from '@faststore/graphql-utils'
import { memo } from 'react'
import type { ReactNode } from 'react'
import type {
  CardControlsProps,
  CarouselControlsProps,
  VariationsProps,
  EffectsProps,
  StyleProps,
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

type Variant = 'wide' | 'default'

export interface ProductCardProps {
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
    style: StyleProps
  }
}

function ProductCard({
  product,
  controls: {
    general: {
      cardControls: {
        showCarousel,
        addImagesLimit,
        imagesQuantity,
        // showSellerName,
        showBrandName,
        showPriceOf,
        // showInstallments,
        // showSkuVariations,
        // showWishlist,
        showBuyButton,
        titleBuyButton,
        // buttonUnavailableTitle,
        // showProductUnabailableMessage,
        // unavailableMessage,
        // applyLink,
        arrows,
        dots,
        // showRating,
        // hoverWishlist,
        // showDesc,
        imageFitIn,
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
    sku,
    isVariantOf: { name },
    image: images,
    offers: {
      lowPrice: spotPrice,
      offers: [{ listPrice, availability }],
    },
  } = product

  const linkProps = useProductLink({ product, selectedOffer: 0, index })
  const outOfStock = availability !== 'https://schema.org/InStock'
  const productImages = [...images]
  const carouselImages = addImagesLimit
    ? productImages.splice(0, imagesQuantity)
    : productImages

  return (
    <UIProductCard
      data-fs-product-card
      data-fs-product-card-variant={variant}
      data-fs-product-card-bordered={bordered}
      data-fs-product-card-actionable={showBuyButton}
      data-fs-product-card-sku={sku}
      className={styles.fsProductCard}
      {...otherProps}
      style={
        showCarousel && images.length > 1
          ? {
              display: 'flex',
              flexDirection: 'column',
            }
          : {}
      }
    >
      {showCarousel && images.length > 1 ? (
        <Components.Carousel
          slidesToShow={1}
          slidesToScroll={1}
          arrows={arrows}
          dots={dots}
          infinite
        >
          {carouselImages.map((image: any, imageIndex: number) => (
            <Image
              key={imageIndex}
              src={image.url}
              alt={image.alternateName}
              width={360}
              height={360 / aspectRatio}
              sizes="(max-width: 768px) 25vw, 30vw"
              loading="lazy"
              options={{
                fitIn: imageFitIn,
              }}
            />
          ))}
        </Components.Carousel>
      ) : (
        <Image
          src={images[0].url}
          alt={images[0].alternateName}
          width={360}
          height={360 / aspectRatio}
          loading="lazy"
          options={{
            fitIn: imageFitIn,
          }}
        />
      )}

      <UIProductCardContent data-fs-product-card-content>
        <div data-fs-product-card-heading>
          <h3 data-fs-product-card-title>
            <Link {...linkProps} title={name}>
              {name}
            </Link>
          </h3>
          {showBrandName && <span data-fs-product-card-brand>{brandName}</span>}
          <div data-fs-product-card-prices>
            <Link {...linkProps} title={name}>
              {showPriceOf && (
                <Price
                  value={listPrice}
                  formatter={useFormattedPrice}
                  testId="list-price"
                  data-value={listPrice}
                  variant="listing"
                  classes="text__legend"
                  SRText="Original price:"
                />
              )}
              <Price
                value={spotPrice}
                formatter={useFormattedPrice}
                testId="price"
                data-value={spotPrice}
                variant="spot"
                classes="text__body"
                SRText="Sale Price:"
              />
            </Link>
          </div>
          {outOfStock ? (
            <Badge>Out of stock</Badge>
          ) : (
            <DiscountBadge listPrice={listPrice} spotPrice={spotPrice} />
          )}
        </div>

        {showBuyButton && (
          <Link {...linkProps} title={name}>
            <UIProductCardActions data-fs-product-card-actions>
              {titleBuyButton}
            </UIProductCardActions>
          </Link>
        )}
      </UIProductCardContent>
    </UIProductCard>
  )
}

export const fragment = gql`
  fragment ProductSummary_product on StoreProduct {
    id: productID
    slug
    sku
    brand {
      brandName: name
    }
    name
    gtin

    isVariantOf {
      productGroupID
      name
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
        quantity
        seller {
          identifier
        }
      }
    }
  }
`

export default memo(ProductCard)
