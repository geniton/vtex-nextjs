import { mark } from 'src/sdk/tests/mark'
import { SiteLinksSearchBoxJsonLd } from 'next-seo'
import storeConfig from 'store.config'
import getPageComponents from 'src/utils/components/get-page-components'
import { GetStaticProps } from 'next'
import RenderDynamicPages from 'src/utils/components/render-dynamic-pages'

function Page({ page: { pageData } }: any) {
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
      <RenderDynamicPages pageData={pageData} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const page = getPageComponents()

  return {
    props: { page, pageName: 'template' },
  }
}

Page.displayName = 'Page'
export default mark(Page)
