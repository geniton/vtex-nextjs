import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next/types'

import getPageComponents from 'src/utils/components/get-page-components'

const useErrorState = () => {
  const router = useRouter()
  const { from } = router.query
  const { pathname } = router

  return {
    fromUrl: from ?? pathname,
  }
}

function Page() {
  const { fromUrl } = useErrorState()

  return (
    <>
      <NextSeo noindex nofollow />

      <h1>Not Found: 404</h1>
      <div>This app could not find url {fromUrl}</div>
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
