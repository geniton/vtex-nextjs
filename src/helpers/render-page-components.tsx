import { NextSeo } from 'next-seo';
import React from 'react';
import storeConfig from 'store.config';

const RenderPageComponents: React.FC<any> = ({
  page
}) => {
  return (
    <>
    <NextSeo
      title={storeConfig.seo.title}
      description={storeConfig.seo.description}
      titleTemplate={storeConfig.seo.titleTemplate}
      canonical={storeConfig.storeUrl}
      openGraph={{
        type: 'website',
        title: storeConfig.seo.title,
        description: storeConfig.seo.description,
      }}
    />

    {
      page.pageData.map(({Component, componentProps}: any, index: number) => (
        <Component key={index} {...componentProps} />
      ))
    }
    </>
  )
}

export default RenderPageComponents;
