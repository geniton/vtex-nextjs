import type { GetStaticProps } from 'next'
import { mark } from 'src/sdk/tests/mark'
import getWpData from 'src/utils/get-wp-data'
import RenderDynamicPages from 'src/helpers/render-dynamic-pages'
import { SiteLinksSearchBoxJsonLd } from 'next-seo'
import storeConfig from 'store.config'

export type Props = { page: any; pageName: string }

function Page({ page, pageName }: Props) {
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
      <RenderDynamicPages
        pageName={pageName}
        {...page.pageData}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const slugPath = 'page/page-home'
  const page = await getWpData(slugPath)

  return {
    props: { page, pageName: 'template' },
  }
}

Page.displayName = 'Page'
export default mark(Page)
