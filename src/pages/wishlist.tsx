import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import getPageComponents from 'src/utils/components/get-page-components'
import RenderComponents from 'src/utils/components/render-components'

function Page({ page }: any) {
  return (
    <>
      <NextSeo noindex nofollow />
      <RenderComponents pageData={page.pageData} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const page = getPageComponents('wishlist')

  return {
    props: { page, pageName: 'wishlist' },
  }
}

export default Page
