import React from 'react'
import { SearchProvider } from '@faststore/sdk'
import renderPlatformComponent from './render-platform-component'
import storeConfig from 'store.config'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import useSearchParams from './use-search-params'
import VARIABLES from '../../../config/variables.json'
import SROnly from 'src/components/ui/SROnly'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import Components from './render-components'

type Props = {
  pageName: string
}

const RenderDynamicPages: React.FC<Props & any> = ({ pageName, ...props }) => {
  const pageProps = {
    ...props,
    storeConfig,
    renderPlatformComponent,
    ...VARIABLES,
  }
  
  const { storeUrl, seo } = storeConfig

  const RenderComponents = ({...otherProps}) => <Components {...pageProps} {...otherProps} />

  const Seo = ({...otherProps}) => (
    <NextSeo
      title={seo.title}
      description={seo.description}
      titleTemplate={seo.titleTemplate}
      canonical={storeUrl}
      openGraph={{
        type: 'website',
        title: seo.title,
        description: seo.description,
      }}
      {...props.seo}
      {...otherProps}
    />
  )


  const components: any = {
    category: () => {
      const applySearchState = useApplySearchState()
      const searchParams = useSearchParams(props)
      const { collection } = props

      return (
        <SearchProvider
          onChange={applySearchState}
          itemsPerPage={ITEMS_PER_PAGE}
          {...searchParams}
        >
          <Seo />
          <BreadcrumbJsonLd
            itemListElements={collection?.breadcrumbList?.itemListElement ?? []}
          />
          <RenderComponents />
        </SearchProvider>
      )
    },
    product: () => {
      const { product } = props
      const { seo } = product
      const canonical = `${storeUrl}${seo.canonical}`
      return (
        <>
          <Seo />
          <BreadcrumbJsonLd
            itemListElements={product?.breadcrumbList?.itemListElement}
          />
          <ProductJsonLd
            productName={product.name}
            description={product.description}
            brand={product.brand.name}
            sku={product.sku}
            gtin={product.gtin}
            releaseDate={product.releaseDate}
            images={product.image.map((img: any) => img.url)}
            offersType="AggregateOffer"
            offers={{
              ...product.offers,
              ...product.offers.offers[0],
              url: canonical,
            }}
          />
          <RenderComponents />
        </>
      )
    },
    default: () => <RenderComponents />,
  }

  return (
    <>
      <Seo />
      {components[pageName] ? components[pageName]() : components.default()}
    </>
  )
}

export default RenderDynamicPages
