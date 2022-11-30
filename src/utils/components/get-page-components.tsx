import Variables from 'config/variables.json'
import MockBannerJSON from 'data/components/banner.json'
import MockTipbarJSON from 'data/components/tipbar.json'
import MockNewsletterJSON from 'data/components/newsletter.json'
import MockStoresJSON from 'data/components/stores.json'
import header from 'data/components/header.json'
import footer from 'data/components/footer.json'
import themeConfigs from 'data/components/theme-configs.json'
import MockProductDetailsJSON from 'data/components/product-details.json'
import MockProductGalleryJSON from 'data/components/product-gallery.json'
import MockBannergridJSON from 'data/components/bannergrid.json'
import MockFirstProductShelfJSON from 'data/components/first-product-shelf.json'
import MockCrossSellingViewShelfJSON from 'data/components/cross-selling-shelf-view.json'
import MockCrossSellingBuyShelfJSON from 'data/components/cross-selling-shelf-buy.json'
import MockSearchResultProductGalleryJSON from 'data/components/search-result-product-gallery.json'
import MockWishlistJSON from 'data/components/wishlist.json'

export default function getPageComponents(pageName?: string) {
  const data: any = {
    themeConfigs,
    header,
    footer,
    pageData: [],
  }

  if (pageName === 'home') {
    data.pageData = [
      {
        id: 101,
        component: 'Banner',
        componentData: { ...MockBannerJSON },
      },
      {
        id: 102,
        component: 'ProductShelf',
        componentData: { ...MockFirstProductShelfJSON, ...Variables },
      },
      {
        id: 103,
        component: 'Tipbar',
        componentData: { ...MockTipbarJSON },
      },
      {
        id: 105,
        component: 'Stores',
        componentData: { ...MockStoresJSON, ...Variables },
      },
      {
        id: 107,
        component: 'Newsletter',
        componentData: { ...MockNewsletterJSON },
      },
    ]
  }

  if (pageName === 'pdp') {
    data.pageData = [
      {
        id: 108,
        component: 'ProductDetails',
        componentData: { ...MockProductDetailsJSON },
      },
      {
        id: 109,
        component: 'CrossSellingShelf',
        componentData: { ...MockCrossSellingViewShelfJSON },
      },
      {
        id: 110,
        component: 'CrossSellingShelf',
        componentData: { ...MockCrossSellingBuyShelfJSON },
      },
    ]
  }

  if (pageName === 'category') {
    data.pageData = [
      {
        id: 111,
        component: 'Bannergrid',
        componentData: { ...MockBannergridJSON },
      },
      {
        id: 112,
        component: 'ProductGallery',
        componentData: { ...MockProductGalleryJSON },
      },
      {
        id: 113,
        component: 'Banner',
        componentData: { ...MockBannerJSON },
      },
    ]
  }

  if (pageName === 'search') {
    data.pageData = [
      {
        id: 114,
        component: 'ProductGallery',
        componentData: { ...MockSearchResultProductGalleryJSON },
      },
    ]
  }

  if (pageName === 'wishlist') {
    data.pageData = [
      {
        id: 115,
        component: 'Wishlist',
        componentData: { ...MockWishlistJSON },
      },
    ]
  }

  return data
}
