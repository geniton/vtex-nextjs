import React from 'react';
import { SearchProvider } from '@faststore/sdk'
import { Components, RenderComponents } from '../store-ui/src'
import renderPlatformComponents from './render-platform-components';
import storeConfig from 'store.config';
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import useSearchParams from '../utils/use-search-params'
import VARIABLES from '../../config/variables.json'
import { NextSeo } from 'next-seo';

const RenderDynamicPages: React.FC<any> = ({
  pageName,
  ...props
}) => {
  const pageProps = {
    ...props,
    storeConfig,
    renderPlatformComponents,
    ...VARIABLES
  }

  const components: any = {
    searchPage: () => {
      const applySearchState = useApplySearchState()
      const searchParams = useSearchParams(props)
      console.log(pageProps)
      return (
        <SearchProvider
        onChange={applySearchState}
        itemsPerPage={ITEMS_PER_PAGE}
        {...searchParams}
      >
        <RenderComponents {...pageProps} />
      </SearchProvider>
      )
    },
    landingPage: () => <Components.LandingPage {...pageProps} />,
    institutionalPage: () => <Components.Institutional {...pageProps} />,
    default: () => <RenderComponents {...pageProps} />
  }

  return (
    <>
      <NextSeo
         title={storeConfig.seo.title}
         description={storeConfig.seo.description}
         titleTemplate={storeConfig.seo.titleTemplate}
         canonical={storeConfig.storeUrl}
         openGraph={{
           type: 'website',
           title: storeConfig.seo.title,
           description: storeConfig.seo.description,
         }}
         {...props.seo}
      />
      {components[pageName] ? components[pageName]() : components.default()}
    </>
  )
}

export default RenderDynamicPages;
