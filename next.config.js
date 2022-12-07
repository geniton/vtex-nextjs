// @ts-check

/**
 * @type {import('next').NextConfig}
 * */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ['pt-BR'],
    defaultLocale: 'pt-BR',
  },
  images: {
    domains: [
      'dev.retailhub.digital',
      'content.retailhub.digital',
      'retailhub.vtexassets.com',
      'retailhub.vteximg.com.br',
      'picsum.photos',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer, dev }) => {
    // https://github.com/vercel/next.js/discussions/11267#discussioncomment-2479112
    // camel-case style names from css modules
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase'
        }
      })

    // Reduce the number of chunks so we ship a smaller first bundle.
    // This should help reducing TBT
    if (!isServer && !dev && config.optimization?.splitChunks) {
      config.optimization.splitChunks.maxInitialRequests = 1
    }

    return config
  },
}

module.exports = nextConfig
