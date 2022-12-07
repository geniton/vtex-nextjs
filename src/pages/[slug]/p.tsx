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
import getPageComponents from 'src/utils/components/get-page-components'
import RenderComponents from 'src/utils/components/render-components'

type PageProps = {
  pageData: any
}

interface Props extends ServerProductPageQueryQuery {
  page: PageProps
}

function Page({ product, page: { pageData } }: Props) {
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

      <RenderComponents product={product} pageData={pageData} />
    </>
  )
}

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

export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const slug: any = params?.slug
  const { data, errors = [] } = await execute<
    ServerProductPageQueryQueryVariables,
    ServerProductPageQueryQuery
  >({
    variables: { slug: slug ?? '' },
    operationName: query,
  })

  const page = getPageComponents('pdp')
  const notFound = errors.find(isNotFoundError)

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  return {
    props: { product: data.product, page },
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
