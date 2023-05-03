import { isNotFoundError } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'

import { useSession } from 'src/sdk/session'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'store.config'
import { RenderComponents } from 'src/utils'
import AudacityClientApi from '@retailhub/audacity-client-api'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN
})

interface Props extends ServerProductPageQueryQuery {
  pageData: {
    page: any
  }
}

function Page({ product, pageData: { page } }: Props) {
  const { currency } = useSession()
  const { seo } = product
  const title = seo.title || storeConfig.seo.title
  const description = seo.description || storeConfig.seo.description
  const canonical = `${storeConfig.storeUrl}${seo.canonical}`

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          type: 'og:product',
          url: canonical,
          title,
          description,
          images: product.image.map((img) => ({
            url: img.url,
            alt: img.alternateName,
          })),
        }}
        additionalMetaTags={[
          {
            property: 'product:price:amount',
            content: product.offers.lowPrice?.toString() ?? undefined,
          },
          {
            property: 'product:price:currency',
            content: currency.code,
          },
        ]}
      />

      <BreadcrumbJsonLd
        itemListElements={product.breadcrumbList.itemListElement}
      />

      <ProductJsonLd
        productName={product.name}
        description={product.description}
        brand={product.brand.name}
        sku={product.sku}
        gtin={product.gtin}
        releaseDate={product.releaseDate}
        images={product.image.map((img) => img.url)} // Somehow, Google does not understand this valid Schema.org schema, so we need to do conversions
        offersType="AggregateOffer"
        offers={{
          ...product.offers,
          ...product.offers.offers[0],
          url: canonical,
        }}
      />

      <RenderComponents product={product} components={page} />
    </>
  )
}

export const fragment = gql`
  fragment ProductSummary_product on StoreProduct {
    id: productID
    data
    slug
    sku
    brand {
      brandName: name
    }
    name
    gtin
    productID
    description
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

    additionalProperty {
      propertyID
      value
      name
      valueReference
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

const query = gql`
  query ServerProductPageQuery($slug: String!) {
    product(locator: [{ key: "slug", value: $slug }]) {
      id: productID

      seo {
        title
        description
        canonical
      }

      brand {
        name
      }

      sku
      gtin
      name
      description
      releaseDate
      link

      breadcrumbList {
        itemListElement {
          item
          name
          position
        }
      }

      image {
        url
        alternateName
      }

      offers {
        lowPrice
        highPrice
        priceCurrency
        offers {
          availability
          price
          priceValidUntil
          priceCurrency
          itemCondition
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

      isVariantOf {
        productGroupID
      }

      ...ProductDetailsFragment_product
    }
  }
`

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string ?? ''
  const { data, errors = [] } = await execute<
    ServerProductPageQueryQueryVariables,
    ServerProductPageQueryQuery
  >({
    variables: { slug },
    operationName: query,
  })

  const pageData = {
    header: null,
    footer: null,
    page: null,
    menus: [],
    themeConfigs: {},
  }

  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  try {
    const { header, footer, menus, page } = await AudacityClient.getAllPageData(
      'page/product'
    )

    if (
      page?.message?.includes('Resource not found') ||
      header?.message?.includes('Resource not found') ||
      footer?.message?.includes('Resource not found') ||
      menus?.message?.includes('Resource not found')
    ) {
      return {
        notFound: true,
      }
    }

    pageData.page = page['pt-BR'].components
    pageData.header = header['pt-BR'].data
    pageData.footer = footer['pt-BR'].data
    pageData.menus = menus.data
    pageData.themeConfigs = {
      colors: page.site.colors,
    }
  } catch ({ message }) {
    console.log(message)

    return {
      notFound: true,
    }
  }

  return {
    props: { product: data.product, pageData, pageType: 'page/product' },
    revalidate: 30,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

Page.displayName = 'Page'

export default mark(Page)
