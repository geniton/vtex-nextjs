import React from 'react'
import { SearchProvider } from '@faststore/sdk'
import { BreadcrumbJsonLd, NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

import storeConfig from 'store.config'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState as UseApplySearchState } from 'src/sdk/search/state'
import VARIABLES from 'config/variables.json'

import UseSearchParams from './use-search-params'
import Components from './render-components'

type Props = {
  pageType: string
}

const RenderDynamicPages: React.FC<Props & any> = ({
  pageType,
  seo,
  ...props
}) => {
  const pageProps = {
    ...props,
    storeConfig,
    ...VARIABLES,
  }

  const RenderComponents = () => <Components {...pageProps} />

  const Seo = () => (
    <NextSeo
      title={seo.title}
      description={seo.description}
      titleTemplate={seo.title}
      canonical={seo.canonical}
      openGraph={{
        type: 'website',
        title: seo.title,
        description: seo.description,
      }}
      {...props.seo}
    />
  )

  const pages: any = {
    category: () => {
      const applySearchState = UseApplySearchState()
      const searchParams = UseSearchParams(props)
      const { collection } = props

      return (
        <SearchProvider
          onChange={applySearchState}
          itemsPerPage={ITEMS_PER_PAGE}
          {...searchParams}
        >
          <Seo />
          <BreadcrumbJsonLd
            itemListElements={collection?.breadcrumbList?.itemListElement ?? []}
          />
          <RenderComponents />
        </SearchProvider>
      )
    },
    'landing-page': () => (
      <>
        <Seo />
        <SiteLinksSearchBoxJsonLd
          url={storeConfig.storeUrl}
          potentialActions={[
            {
              target: `${storeConfig.storeUrl}/s/?q`,
              queryInput: 'search_term_string',
            },
          ]}
        />
        <RenderComponents />
      </>
    ),
  }

  if (!pages[pageType]) null

  return (
    <>
      <Seo />
      {pages[pageType]()}
    </>
  )
}

export default RenderDynamicPages
