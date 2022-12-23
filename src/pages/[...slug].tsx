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
    themeConfigs: {},
    pageData: null
  }
  
  try {
    let cmsData = await api.getCMSpage(slug.join('/'))

    if (cmsData?.message === 'Resource not found') {
      cmsData = await api.getCMSpage('category')
      pageName = 'category'
    }

    page.themeConfigs = {
      colors: cmsData.site.colors
    }

    page.pageData = cmsData['pt-BR'].components
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
