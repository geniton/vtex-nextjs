import {
  ProductCard as UIProductCard,
  ProductCardActions as UIProductCardActions,
  ProductCardContent as UIProductCardContent,
} from '@faststore/ui'
import { gql } from '@faststore/graphql-utils'
import { memo, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CardControlsProps,
  CarouselControlsProps,
  VariationsProps,
  EffectsProps,
  StyleProps,
} from '@retailhub/audacity-ui/src/types'
import { Components } from '@retailhub/audacity-ui'

import { getData, saveData } from 'src/utils/local-storage'
import Link from 'src/components/ui/Link'
import { Badge, DiscountBadge } from 'src/components/ui/Badge'
import { Image } from 'src/components/ui/Image'
import Price from 'src/components/ui/Price'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProductLink } from 'src/sdk/product/useProductLink'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import styles from 'src/components/product/ProductCard/product-card.module.scss'
import ButtonLink from 'src/components/ui/Button/ButtonLink'
import * as API from 'src/utils/api'

type Variant = 'wide' | 'default'

export interface ProductCardProps {
  onChangeLike?: (like: boolean) => void
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
  onChangeLike,
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
        showWishlist,
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
  const [isLiked, setIsLiked] = useState(false)
  // const { person } = useSession()
  const person = {
    id: '3d6381e7-ac3f-4972-bbb9-35bcf8da7677',
  }

  function getWishlistData() {
    return getData('wishlist')
  }

  function setWishlistData(value: number[]) {
    saveData('wishlist', value)
  }

  const checkProductOnWishlist = useCallback(() => {
    const wishlistData = getWishlistData() || []

    return wishlistData.filter((itemId: number) => +itemId === +product.id)
      .length
  }, [])

  function likeToggle() {
    const isProductOnWishlist = checkProductOnWishlist()

    const wishlistData: any = getWishlistData() || []
    let like = false

    if (isProductOnWishlist) {
      wishlistData.splice(wishlistData.indexOf(product.sku), 1)
    } else {
      like = true
      wishlistData.push(product.sku)
    }

    setIsLiked(like)
    setWishlistData(wishlistData)

    const payload = {
      acronym: 'WL',
      products: JSON.stringify(wishlistData),
      userId: '3d6381e7-ac3f-4972-bbb9-35bcf8da7677',
    }

    API.saveMasterData(payload)

    onChangeLike?.(like)
  }

  function wishlist() {
    if (!showWishlist) return null

    if (person?.id) {
      return (
        <button
          type="button"
          data-fs-product-card-like
          data-fs-product-card-like-active={isLiked}
          onClick={() => likeToggle()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26.059"
            height="23.821"
            viewBox="0 0 26.059 23.821"
          >
            <path
              d="M1221.828,73.057a.745.745,0,0,0,1.229.01,6.481,6.481,0,0,1,5.386-2.923c3.615,0,6.219,3.093,6.547,6.78a6.725,6.725,0,0,1-.212,2.562,11.336,11.336,0,0,1-3.453,5.759l-8.374,7.472a.761.761,0,0,1-1.016,0l-8.228-7.469a11.328,11.328,0,0,1-3.453-5.758,6.738,6.738,0,0,1-.213-2.563c.328-3.686,2.932-6.78,6.547-6.78A6.193,6.193,0,0,1,1221.828,73.057Z"
              transform="translate(-1209.486 -69.643)"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="1"
            />
          </svg>
        </button>
      )
    }

    return (
      <ButtonLink
        href="/login"
        data-fs-product-card-like
        data-fs-product-card-like-active={isLiked}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26.059"
          height="23.821"
          viewBox="0 0 26.059 23.821"
        >
          <path
            d="M1221.828,73.057a.745.745,0,0,0,1.229.01,6.481,6.481,0,0,1,5.386-2.923c3.615,0,6.219,3.093,6.547,6.78a6.725,6.725,0,0,1-.212,2.562,11.336,11.336,0,0,1-3.453,5.759l-8.374,7.472a.761.761,0,0,1-1.016,0l-8.228-7.469a11.328,11.328,0,0,1-3.453-5.758,6.738,6.738,0,0,1-.213-2.563c.328-3.686,2.932-6.78,6.547-6.78A6.193,6.193,0,0,1,1221.828,73.057Z"
            transform="translate(-1209.486 -69.643)"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="1"
          />
        </svg>
      </ButtonLink>
    )
  }

  useEffect(() => {
    if (checkProductOnWishlist() && person.id) {
      setIsLiked(true)
    }
  }, [])

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
      {wishlist()}
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
    productID

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
