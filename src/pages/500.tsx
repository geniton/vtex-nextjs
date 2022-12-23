import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import api from 'src/utils/api'

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

export const getStaticProps = async () => {
  const page = {
    themeConfigs: {},
  }

  try {
    const data = await api.getCMSpage('homepage')

    page.themeConfigs = {
      colors: data.site.colors,
    }

    if (data?.message === 'Resource not found') {
      return {
        notFound: true,
      }
    }
  } catch ({ message }: any) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page },
  }
}

export default Page
