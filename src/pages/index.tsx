import { NextSeo } from 'next-seo'
import type { GetStaticProps } from 'next'
import { RenderComponents } from '../store-ui/src'
import renderPlatformComponents from '../utils/render-platform-components'

// import RenderPageSections from 'src/components/cms/RenderPageSections'
import { mark } from 'src/sdk/tests/mark'

import storeConfig from '../../store.config'
import Variables from '../../config/variables.json'
import getWpData from 'src/utils/get-wp-data'

export type Props = { data: any }

function Page({ data }: Props) {
  return (
    <>
      <NextSeo
        title={storeConfig.seo.title}
        description={storeConfig.seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
        }}
      />

      {/* <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q={search_term_string}`,
            queryInput: 'required name=search_term_string',
          },
        ]}
      /> */}

      {/* <Components.NotFound content="content" /> */}

      <RenderComponents
        apiBaseUrl={Variables.apiBaseUrl}
        baseImageUrl={Variables.baseImageUrl}
        renderPlatformComponents={renderPlatformComponents}
        websiteUrls={Variables.websiteUrls}
        {...data.page}
      />

      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}
      {/* <RenderPageSections sections={cmsHome.sections} /> */}
    </>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const slugPath = 'page-home'
  const data = await getWpData(slugPath)

  return {
    props: { data },
  }
}

Page.displayName = 'Page'
export default mark(Page)
