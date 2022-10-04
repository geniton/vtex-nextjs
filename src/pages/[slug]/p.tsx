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
import getWpData from 'src/utils/get-wp-data'
import RenderDynamicPages from 'src/helpers/render-dynamic-pages'

interface Props extends ServerProductPageQueryQuery {
  product: any
  page: any
  pageName: string
}

function Page({ product, page: { themeConfigs, pageData }, pageName }: Props) {
  const { currency } = useSession()
  const { seo } = product
  const title = seo.title || storeConfig.seo.title
  const description = seo.description || storeConfig.seo.description
  const canonical = `${storeConfig.storeUrl}${seo.canonical}`

  return (
    <RenderDynamicPages
      {...pageData}
      pageName={pageName}
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
      themeConfigs={themeConfigs}
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

interface PageProps {
  product: any
  page: any
  pageName: string
}

export const getStaticProps: GetStaticProps<
PageProps,
  { slug: string }
> = async ({ params }) => {
  const slug: any = params?.slug
  const { data, errors = [] } = await execute<
    ServerProductPageQueryQueryVariables,
    ServerProductPageQueryQuery
  >({
    variables: { slug: params?.slug ?? '' },
    operationName: query,
  })

  const notFound = errors.find(isNotFoundError)

  const pageName = 'default'

  if (slug?.length && slug.length > 1 && slug[0] === 'blog') {
    slug.shift()
  }

  const response = await getWpData('page/page-product')

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  return {
    props: { product: data.product, page: response, pageName},
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
