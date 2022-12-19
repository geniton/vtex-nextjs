import { parseSearchState, SearchProvider } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { SearchState } from '@faststore/sdk'
import type { GetServerSideProps } from 'next/types'

import Breadcrumb from 'src/components/sections/Breadcrumb'
import SROnly from 'src/components/ui/SROnly'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import { mark } from 'src/sdk/tests/mark'
import getPageComponents from 'src/utils/components/get-page-components'
import { Components as PlatformComponents } from 'src/utils/components/platform'
import api from 'src/utils/api'

import storeConfig from '../../store.config'
import RenderComponents from '../utils/components/render-components'
import VARIABLES from '../../config/variables.json'

const useSearchParams = () => {
  const [params, setParams] = useState<SearchState | null>(null)
  const { asPath } = useRouter()

  useEffect(() => {
    const url = new URL(asPath, 'http://localhost')

    setParams(parseSearchState(url))
  }, [asPath])

  return params
}

type Props = {
  page: any
}

function Page({ page: { pageData }, ...props }: Props) {
  const searchParams = useSearchParams()
  const applySearchState = useApplySearchState()
  const { description, titleTemplate } = storeConfig.seo
  const title = 'Search Results'

  if (!searchParams) {
    return null
  }

  const pageProps = {
    ...props,
    storeConfig,
    PlatformComponents,
    ...VARIABLES,
  }

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={ITEMS_PER_PAGE}
      {...searchParams}
    >
      <NextSeo
        noindex
        title={title}
        description={description}
        titleTemplate={titleTemplate}
        openGraph={{
          type: 'website',
          title,
          description,
        }}
      />

      <SROnly as="h1" text={title} />

      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}

      <div className="container">
        <Breadcrumb name={searchParams?.term || ''} />
      </div>

      <RenderComponents pageData={pageData} {...pageProps} />
    </SearchProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const page = getPageComponents('search')

  try {
    const data = await api.getCMSpage('search')

    page.pageData = data['pt-BR'].components

    if (data?.message === 'Resource not found') {
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
    props: { page },
  }
}

Page.displayName = 'Page'

export default mark(Page)
