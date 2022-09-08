module.exports = {
  seo: {
    title: 'Retailhub',
    description: 'Retailhub FastStore',
    titleTemplate: '%s | FastStore',
    author: 'Retailhub Framework',
  },

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: 'retailhub',
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
  },

  // Default session
  session: {
    currency: {
      code: 'USD',
      symbol: '$',
    },
    locale: 'en-US',
    channel: '{"salesChannel":"1","regionId":""}',
    country: 'USA',
    postalCode: null,
    person: null,
  },

  // Production URLs
  storeUrl: 'https://loja.retailhub.digital',
  secureSubdomain: 'https://secure.loja.retailhub.digital',
  checkoutUrl: 'https://secure.loja.retailhub.digital/checkout',
  loginUrl: 'https://secure.loja.retailhub.digital/api/io/login',
  accountUrl: 'https://secure.loja.retailhub.digital/api/io/account',

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: '/apple-magic-mouse/p',
      collection: '/office',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: '/apple-magic-mouse/p',
      collection: '/office',
      collection_filtered:
        '/office/?category-1=office&marca=acer&facets=category-1%2Cmarca',
      search: '/s?q=orange',
    },
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: 'GTM-PGHZ95N',
  },
}
