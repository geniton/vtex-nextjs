import { useEffect } from 'react'
import type { GetStaticProps } from 'next/types'
import { NextSeo } from 'next-seo'
import { Components } from '@retailhub/audacity-ui'

import getPageComponents from 'src/utils/components/get-page-components'

import storeConfig from '../../store.config'

function Page() {
  useEffect(() => {
    window.location.href = storeConfig.checkoutUrl
  }, [])

  return (
    <>
      <NextSeo noindex nofollow />

      <Components.Container>
        <Components.LoadingPage />
      </Components.Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const page = getPageComponents()

  return {
    props: { page },
  }
}

export default Page
