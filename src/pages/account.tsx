import { useEffect } from 'react'
import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import getPageComponents from 'src/utils/components/get-page-components'

import storeConfig from '../../store.config'

function Page() {
  useEffect(() => {
    window.location.href = storeConfig.accountUrl
  }, [])

  return (
    <>
      <NextSeo noindex nofollow />

      <div>loading...</div>
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
