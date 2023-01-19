import { gql } from '@faststore/graphql-utils'
import type { GetServerSideProps } from 'next/types'

import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import storeConfig from 'store.config'
import api from 'src/utils/api'

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

export const getServerSideProps: GetServerSideProps<
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

  const page = {
    header: null,
    footer: null,
    pageData: null,
    menus: null,
    themeConfigs: {},
  }

  try {
    let pageData = await api.audacityCMS(`page/${slug.join('/')}`)

    if (pageData?.message === 'Resource not found') {
      pageData = await api.audacityCMS('page/category')
      pageName = 'category'
    }

    const header = await api.audacityCMS('header')
    const footer = await api.audacityCMS('footer')
    const menus = await api.audacityCMS('menu')

    page.header = header['pt-BR'].data
    page.footer = footer['pt-BR'].data
    page.pageData = pageData['pt-BR'].components
    page.menus = menus.data
    page.themeConfigs = {
      colors: pageData.site.colors,
    }

    if (
      pageData?.message === 'Resource not found' ||
      header?.message === 'Resource not found' ||
      footer?.message === 'Resource not found'
    ) {
      return {
        notFound: true,
      }
    }
  } catch ({ message }: any) {
    return {
      notFound: true,
    }
  }

  return {
    props: { collection: data?.collection ?? null, page, pageName },
  }
}

Page.displayName = 'Page'
export default mark(Page)
