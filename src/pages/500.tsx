import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next/types'

import getPageComponents from 'src/utils/components/get-page-components'

const useErrorState = () => {
  const router = useRouter()
  const { errorId, fromUrl } = router.query

  return {
    errorId,
    fromUrl,
  }
}

function Page() {
  const { errorId, fromUrl } = useErrorState()

  return (
    <>
      <NextSeo noindex nofollow />

      <h1>500</h1>
      <h2>Internal Server Error</h2>

      <div>
        The server errored with id {errorId} when visiting page {fromUrl}
      </div>
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
