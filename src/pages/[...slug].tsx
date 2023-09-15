import { gql } from '@faststore/graphql-utils'
import type { GetServerSideProps } from 'next/types'
import AudacityClientApi from '@retailhub/audacity-client-api'
import { Utils } from '@retailhub/audacity'

import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'store.config'

import { RenderDynamicPages } from '../utils'

const AudacityClient = new AudacityClientApi(
  process.env.AUDACITY_TOKEN,
  process.env.ENV
)

interface Props extends ServerCollectionPageQueryQuery {
  pageType: string
  pageData: any
}

function Page({ pageData: { page, seo }, collection, ...props }: Props) {
  return (
    <RenderDynamicPages
      seo={seo}
      components={page}
      collection={collection}
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

export const getServerSideProps: GetServerSideProps<
  PageProps,
  { slug: string[] }
> = async ({ params }) => {
  const slug: any = params?.slug
  const pathSlug = slug.join('/')
  const lastPartSlug = slug.at(-1)
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
    modals: [],
    seo: {
      title: storeConfig.seo.title,
      description: storeConfig.seo.description,
      canonical: storeConfig.storeUrl,
    },
  }

  let pageResponse = await AudacityClient.getPage(`page/${lastPartSlug}`)

  if (pageResponse.data?.page_type === 'category') {
    pageType = 'category'
  }

  // start validating parent page
  const parentSlug = pageResponse?.data?.parent?.['pt-BR']?.slug

  if (
    (slug.length >= 2 && !parentSlug && !data) ||
    (parentSlug && `${parentSlug}/${lastPartSlug}` !== pathSlug)
  ) {
    return {
      notFound: true,
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
    colors: pageResponse.data.site?.colors ?? null,
    favicon: pageResponse.data.site?.seo?.['pt-BR']?.favicon ?? null,
    scripts: pageResponse.data.site?.scripts ?? null,
  }
  pageData.seo = {
    ...Utils.Formats.formatSeo({
      collection: data?.collection,
      page: pageResponse.data,
    }),
    canonical: `${storeConfig.storeUrl}/${pathSlug}`,
  }
  pageData.modals = pageResponse.data.modals ?? []

  return {
    props: { collection: data?.collection ?? null, pageData, pageType },
  }
}

Page.displayName = 'Page'
export default mark(Page)
