import { parseSearchState, SearchProvider } from '@faststore/sdk'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { SearchState } from '@faststore/sdk'
import type { GetStaticProps } from 'next/types'
import AudacityClientApi from '@retailhub/audacity-client-api'
import { Utils } from '@retailhub/audacity'

import Breadcrumb from 'src/components/sections/Breadcrumb'
import SROnly from 'src/components/ui/SROnly'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import { mark } from 'src/sdk/tests/mark'
import {
  RenderComponents,
  NextjsComponents,
  NextjsHooks,
  VtexHooks,
  VtexUtils,
  VtexQueries,
} from 'src/utils'
import storeConfig from 'store.config'
import VARIABLES from 'config/variables.json'

const AudacityClient = new AudacityClientApi(
  process.env.AUDACITY_TOKEN,
  process.env.ENV
)

const useSearchParams = () => {
  const [params, setParams] = useState<SearchState | null>(null)
  const { asPath } = useRouter()

  useEffect(() => {
    const url = new URL(asPath, 'http://localhost')
    const urlSearchParams = new URLSearchParams(window.location.search)
    const parameters = Object.fromEntries(urlSearchParams.entries())
    const searchState: any = parseSearchState(url)
    const paramKeys = searchState?.selectedFacets?.length
      ? searchState.selectedFacets.map(({ key }: { key: string }) => key)
      : []

    for (const key in parameters) {
      if (
        key === 'productClusterIds' ||
        key === 'c' ||
        (key && key.includes('specificationFilter_'))
      ) {
        if (!paramKeys.includes(key)) {
          searchState.selectedFacets.push({
            key,
            value: parameters[key],
          })
        }
      }
    }

    setParams(searchState)
  }, [asPath])

  return params
}

type Props = {
  pageData: any
}

function Page({ pageData: { page, seo }, ...props }: Props) {
  const searchParams = useSearchParams()
  const applySearchState = useApplySearchState()
  const { title, description } = seo

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
        titleTemplate={title}
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

      <div className="aud-container">
        <Breadcrumb name={searchParams?.term || ''} />
      </div>

      <RenderComponents components={page} {...pageProps} />
    </SearchProvider>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const pageData = {
    header: null,
    footer: null,
    page: null,
    menus: [],
    themeConfigs: {},
    seo: {
      title: '',
      description: '',
    },
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

    pageData.page = page['pt-BR'].components
    pageData.header = header['pt-BR'].data
    pageData.footer = footer['pt-BR'].data
    pageData.menus = menus.data
    pageData.themeConfigs = {
      colors: page.site?.colors ?? null,
      favicon: page.site?.seo?.['pt-BR']?.favicon ?? null,
      scripts: page.site?.scripts ?? null,
    }

    pageData.seo = Utils.Formats.formatSeo({
      page,
    })
  } catch ({ message }) {
    return {
      notFound: true,
    }
  }

  return {
    props: { pageData },
    revalidate: 30,
  }
}

Page.displayName = 'Page'

export default mark(Page)
