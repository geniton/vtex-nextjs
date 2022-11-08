import { isNotFoundError } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'src/sdk/session'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from '@generated/graphql'

import storeConfig from '../../../store.config'
import getPageComponents from 'src/utils/components/get-page-components'
import RenderDynamicPages from 'src/utils/components/render-dynamic-pages'

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
    <RenderDynamicPages
      pageData={pageData}
      pageName="product"
      seo={{
        title,
        description,
        canonical,
        openGraph: {
          type: 'og:product',
          url: canonical,
          title,
          description,
          images: product.image.map((img: any) => ({
            url: img.url,
            alt: img.alternateName,
          })),
        },
        additionalMetaTags: [
          {
            property: 'product:price:amount',
            content: product.offers.lowPrice?.toString() ?? undefined,
          },
          {
            property: 'product:price:currency',
            content: currency.code,
          },
        ],
      }}
      product={product}
    />
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

  const notFound = errors.find(isNotFoundError)

  const page = getPageComponents('product')

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
