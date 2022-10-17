import { mark } from 'src/sdk/tests/mark'
import { SiteLinksSearchBoxJsonLd } from 'next-seo'
import storeConfig from 'store.config'
import getPageComponents from 'src/utils/get-page-components'
import RenderPageComponents from 'src/helpers/render-page-components'

function Page() {
  const page = getPageComponents()

  return (
    <>
     <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q={search_term_string}`,
            queryInput: 'required name=search_term_string',
          },
        ]}
      />
      <RenderPageComponents page={page} />
    </>
  )
}

Page.displayName = 'Page'
export default mark(Page)
