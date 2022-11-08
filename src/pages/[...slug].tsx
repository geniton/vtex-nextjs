import { gql } from '@faststore/graphql-utils'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import RenderDynamicPages from '../utils/components/render-dynamic-pages'
import storeConfig from 'store.config'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import getPageName from 'src/utils/components/get-page-name'
import getPageComponents from 'src/utils/components/get-page-components'

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

  const pageName = getPageName(slug)

  const page = getPageComponents('category')

  return {
    props: { collection: data?.collection ?? null, page, pageName },
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
