const {
  seo,
  api,
  session,
  storeUrl,
  secureSubdomain,
  checkoutUrl,
  loginUrl,
  accountUrl,
  lighthouse,
  cypress,
  analytics,
} = require('config/variables.json')

module.exports = {
  seo,

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api,

  // Default session
  session,

  // Production URLs
  storeUrl,
  secureSubdomain,
  checkoutUrl,
  loginUrl,
  accountUrl,

  // Lighthouse CI
  lighthouse: {
    ...lighthouse,
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
  },

  // E2E CI
  cypress,

  // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
  analytics,
}
