import { gql } from '@faststore/graphql-utils'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import RenderDynamicPages from '../helpers/render-dynamic-pages'

import getWpData from 'src/utils/get-wp-data'
import getPageName from 'src/utils/get-page-name'
import storeConfig from 'store.config'
import { GetStaticPaths, GetStaticProps } from 'next/types'

interface Props extends ServerCollectionPageQueryQuery {
  pageName: string
  page: any
}
function Page({
  page: { pageData, themeConfigs },
  collection,
  pageName,
}: Props) {
  return (
    <RenderDynamicPages
      themeConfigs={themeConfigs}
      collection={collection}
      pageName={pageName}
      seo={{
        openGraph: {
          type: 'website',
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
        },
      }}
      {...pageData}
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
  const { data, errors = [] } = await execute<
    ServerCollectionPageQueryQueryVariables,
    ServerCollectionPageQueryQuery
  >({
    variables: { slug: slug.join('/') ?? '' },
    operationName: query,
  })

  const pageName = getPageName(slug)

  if (slug?.length && slug.length > 1 && slug[0] === 'blog') {
    slug.shift()
  }

  const response = await getWpData(`page/${slug[0]}`)

  return {
    props: { collection: data?.collection ?? null, page: response, pageName },
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
