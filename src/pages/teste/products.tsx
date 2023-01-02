import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import { Components } from '@retailhub/audacity-ui'
import MockData from 'data/components/products.json'
import { Hooks, Queries } from 'src/utils/components/platform'

function Page() {
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
      <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q`,
            queryInput: 'search_term_string',
          },
        ]}
      />
      <Components.Products
        PlatformQueries={Queries}
        PlatformHooks={Hooks}
        {...MockData}
      />
    </>
  )
}

export default mark(Page)
