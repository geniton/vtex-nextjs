import type { GetStaticPaths, GetStaticProps } from 'next'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import AudacityClientApi from '@retailhub/audacity-client-api'
import { VtexUtils, Services } from '@retailhub/audacity-vtex'

// import { useSession } from 'src/sdk/session'
import { mark } from 'src/sdk/tests/mark'
import storeConfig from 'store.config'
import { RenderComponents } from 'src/utils'
import { useSession } from 'src/sdk/session'

const AudacityClient = new AudacityClientApi({
  token: process.env.AUDACITY_TOKEN,
})

interface Props {
  skuId: string
  product: any
  seo: any
  pageData: {
    page: any
    seo: {
      title: string
      description: string
      canonical: string
    }
  }
}

function Page({ product, skuId, pageData: { page, seo } }: Props) {
  const { currency } = useSession()
  const { title, description, canonical } = seo
  const seller = VtexUtils.Product.getSellerLowPrice(product?.sellers)

  const images = product?.images.map((img: any) => ({
    url: img.url,
    alt: img.alternateName,
  }))

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          type: 'og:product',
          url: canonical,
          title,
          description,
          images: images.map((img: any) => ({
            url: img.url,
            alt: img.alternateName,
          })),
        }}
        additionalMetaTags={[
          {
            property: 'product:price:amount',
            content: seller?.commertialOffer?.Price.toString() ?? undefined,
          },
          {
            property: 'product:price:currency',
            content: currency.code,
          },
        ]}
      />

      <BreadcrumbJsonLd
        itemListElements={product.breadcrumbs.itemListElement}
      />

      <ProductJsonLd
        productName={product.name}
        description={product.description}
        brand={product.brand.name}
        sku={product.sku}
        gtin={product.gtin}
        releaseDate={product.releaseDate}
        images={images.map(({ url }: { url: string }) => url)} // Somehow, Google does not understand this valid Schema.org schema, so we need to do conversions
        offersType="AggregateOffer"
        offers={{
          ...seller.commertialOffer,
          url: canonical,
        }}
      />

      <RenderComponents product={product} skuId={skuId} components={page} />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = (params?.slug as string) ?? ''
  const arr = slug.split('-')
  const skuId = String(arr.splice(arr.length - 1, 1)?.[0])
  const newSlug = arr.join('-')

  const pageData = {
    header: null,
    footer: null,
    page: null,
    menus: [],
    themeConfigs: {},
    product: {} as any,
    seo: {
      title: '',
      description: '',
      canonical: '',
    },
  }

  try {
    const [responsePageData, productData] = await Promise.all([
      AudacityClient.getAllPageData('page/product'),
      Services.getProduct({
        store: storeConfig.api.storeId,
        slug: newSlug,
        appKey: process.env.VTEX_APP_KEY || '',
        appToken: process.env.VTEX_APP_TOKEN || '',
      }),
    ])

    const PRODUCT = productData.data?.[0]

    if (
      responsePageData.page?.message?.includes('Resource not found') ||
      responsePageData.header?.message?.includes('Resource not found') ||
      responsePageData.footer?.message?.includes('Resource not found') ||
      responsePageData.menus?.message?.includes('Resource not found') ||
      !productData?.data?.length
    ) {
      return {
        notFound: true,
      }
    }

    pageData.page = responsePageData.page['pt-BR'].components
    pageData.header = responsePageData.header['pt-BR'].data
    pageData.footer = responsePageData.footer['pt-BR'].data
    pageData.menus = responsePageData.menus.data
    pageData.themeConfigs = {
      colors: responsePageData.page.site.colors,
    }

    pageData.product = PRODUCT

    pageData.seo = {
      title: PRODUCT?.productTitle || PRODUCT?.productName,
      description: PRODUCT?.metaTagDescription || PRODUCT?.description,
      canonical: `${storeConfig.storeUrl}/${PRODUCT?.linkText}/p`,
    }
  } catch ({ message }) {
    console.log(message)

    return {
      notFound: true,
    }
  }

  return {
    props: {
      product: {
        ...VtexUtils.Product.getVariant(pageData.product, skuId),
        productName: pageData.product.productName,
        productId: pageData.product.productId,
      },
      skuId,
      pageData,
      pageType: 'page/product',
    },
    revalidate: 30,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

Page.displayName = 'Page'

export default mark(Page)
