import { gql } from '@faststore/graphql-utils'
import type { GetStaticPaths, GetStaticProps } from 'next/types'

import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'store.config'
import { getFooter, getHeader, getMenus, getPage } from 'src/services/audacity'

import RenderDynamicPages from '../utils/components/render-dynamic-pages'

interface Props extends ServerCollectionPageQueryQuery {
  pageName: string
  page: any
}

function Page({ page: { pageData }, ...props }: Props) {
  return (
    <RenderDynamicPages
      pageData={pageData}
      seo={{
        openGraph: {
          type: 'website',
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
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
  page: any
}

export const getStaticProps: GetStaticProps<
  PageProps,
  { slug: string[] }
> = async ({ params }) => {
  const slug: any = params?.slug
  const { data } = await execute<
    ServerCollectionPageQueryQueryVariables,
    ServerCollectionPageQueryQuery
  >({
    variables: { slug: slug.join('/') ?? '' },
    operationName: query,
  })

  let pageName = 'landing-page'

  const page: any = {
    header: null,
    footer: null,
    pageData: null,
    menus: null,
    themeConfigs: {},
  }

  try {
    let pageData = await getPage(`${`/page/${slug.join('/')}`}`)

    if (pageData?.message?.includes('Resource not found') && !data) {
      return {
        notFound: true
      }
    }

    if (pageData?.message?.includes('Resource not found')) {
      pageData = await getPage('/page/category')
      pageName = 'category'
    }

    const [header, footer, menus] = await Promise.all([
      getHeader(),
      getFooter(),
      getMenus(),
    ])

    if (
      pageData?.message?.includes('Resource not found') ||
      header?.message?.includes('Resource not found') ||
      footer?.message?.includes('Resource not found') ||
      menus?.message?.includes('Resource not found')
    ) {
      return {
        notFound: true,
      }
    }

    page.header = header['pt-BR'].data
    page.footer = footer['pt-BR'].data
    page.menus = menus.data
    page.pageData = pageData['pt-BR'].components ?? []
    page.themeConfigs = {
      colors: pageData.site.colors,
    }
  } catch ({ message }: any) {
    return {
      notFound: true,
    }
  }

  return {
    props: { collection: data?.collection ?? null, page, pageName },
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
