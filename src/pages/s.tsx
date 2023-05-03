import { parseSearchState, SearchProvider } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { SearchState } from '@faststore/sdk'
import type { GetStaticProps } from 'next/types'

import Breadcrumb from 'src/components/sections/Breadcrumb'
import SROnly from 'src/components/ui/SROnly'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import { mark } from 'src/sdk/tests/mark'
import { RenderComponents, NextjsComponents, NextjsHooks, VtexHooks, VtexUtils, VtexQueries } from 'src/utils'

import storeConfig from 'store.config'
import VARIABLES from 'config/variables.json'
import AudacityClientApi from '@retailhub/audacity-client-api'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN
})

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
  const title = 'Procurar Resultados'

  if (!searchParams) {
    return null
  }

  const pageProps = {
    ...props,
    storeConfig,
    VtexHooks,
    VtexUtils,
    VtexQueries,
    NextjsComponents,
    NextjsHooks,
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

      <RenderComponents components={pageData} {...pageProps} />
    </SearchProvider>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const data = {
    header: null,
    footer: null,
    pageData: null,
    menus: [],
    themeConfigs: {},
  }

  try {
    const { header, footer, menus, page } = await AudacityClient.getAllPageData(
      'page/search'
    )

    if (
      page?.message?.includes('Resource not found') ||
      header?.message?.includes('Resource not found') ||
      footer?.message?.includes('Resource not found') ||
      menus?.message?.includes('Resource not found')
    ) {
      return {
        notFound: true,
      }
    }

    data.pageData = page['pt-BR'].components
    data.header = header['pt-BR'].data
    data.footer = footer['pt-BR'].data
    data.menus = menus.data
    data.themeConfigs = {
      colors: page.site.colors,
    }
  } catch ({ message }) {
    return {
      notFound: true,
    }
  }

  return {
    props: { pageData: data },
    revalidate: 30,
  }
}

Page.displayName = 'Page'

export default mark(Page)
