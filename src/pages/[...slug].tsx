import { gql } from '@faststore/graphql-utils'
import type { GetStaticPaths, GetStaticProps } from 'next/types'
import AudacityClientApi from '@retailhub/audacity-client-api'

import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'store.config'

import { RenderDynamicPages } from '../utils'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN,
})

interface Props extends ServerCollectionPageQueryQuery {
  pageType: string
  pageData: any
}

function Page({ pageData: { page }, collection, ...props }: Props) {
  return (
    <RenderDynamicPages
      components={page}
      collection={collection}
      seo={{
        title: collection?.seo?.title ?? storeConfig.seo.title,
        description:
          collection?.seo?.description ?? storeConfig.seo.description,
        openGraph: {
          type: 'website',
          title: collection?.seo?.title ?? storeConfig.seo.title,
          description:
            collection?.seo?.description ?? storeConfig.seo.description,
        },
      }}
      {...props}
    />
  )
}

const query = gql`
  query ServerCollectionPageQuery($slug: String!) {
    collection(slug: $slug) {
      seo {
        title
        description
      }
      breadcrumbList {
        itemListElement {
          item
          name
          position
        }
      }
      meta {
        selectedFacets {
          key
          value
        }
      }
    }
  }
`

interface PageProps {
  collection: any
  pageData: any
}

export const getStaticProps: GetStaticProps<
  PageProps,
  { slug: string[] }
> = async ({ params }) => {
  const slug: any = params?.slug
  const pathSlug = slug.join('/')
  const { data } = await execute<
    ServerCollectionPageQueryQueryVariables,
    ServerCollectionPageQueryQuery
  >({
    variables: { slug: pathSlug ?? '' },
    operationName: query,
  })

  let pageType = 'landing-page'

  const pageData = {
    header: null,
    footer: null,
    page: null as any,
    menus: null,
    themeConfigs: {},
  }

  let pageResponse = await AudacityClient.getPage(`page/${pathSlug}`)

  // start validating parent page

  const parentSlug = pageResponse?.data?.parent?.slug?.['pt-BR']

  if (parentSlug && `${parentSlug}/${pathSlug}` !== pathSlug) {
    return {
      notFound: true,
    }
  }

  // end validating parent page

  if (pageResponse.data?.page_type === 'category') {
    pageType = pageResponse.data.page_type
  }

  if (pageResponse.data?.message?.includes('Resource not found') && !data) {
    pageResponse = await AudacityClient.getPage(`page/${slug[slug.length - 1]}`)

    if (pageResponse.data?.message?.includes('Resource not found')) {
      return {
        notFound: true,
      }
    }
  }

  if (pageResponse.data?.message?.includes('Resource not found')) {
    pageResponse = await AudacityClient.getPage('page/category')
    pageType = 'category'
  }

  const [header, footer, menus] = await Promise.all([
    AudacityClient.getHeader(),
    AudacityClient.getFooter(),
    AudacityClient.getMenus(),
  ])

  if (
    pageResponse?.data?.message?.includes('Resource not found') ||
    header?.data?.message?.includes('Resource not found') ||
    footer?.data?.message?.includes('Resource not found') ||
    menus?.data?.message?.includes('Resource not found')
  ) {
    return {
      notFound: true,
    }
  }

  pageData.header = header.data['pt-BR'].data
  pageData.footer = footer.data['pt-BR'].data
  pageData.menus = menus.data?.data
  pageData.page = pageResponse.data['pt-BR'].components ?? []
  pageData.themeConfigs = {
    colors: pageResponse.data.site?.colors,
  }

  return {
    props: { collection: data?.collection ?? null, pageData, pageType },
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
