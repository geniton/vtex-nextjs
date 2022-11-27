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
        componentName: 'Banner',
        componentProps: { ...MockBannerJSON },
      },
      {
        id: 102,
        componentName: 'ProductShelf',
        componentProps: { ...MockFirstProductShelfJSON, ...Variables },
      },
      {
        id: 103,
        componentName: 'Tipbar',
        componentProps: { ...MockTipbarJSON },
      },
      {
        id: 105,
        componentName: 'Stores',
        componentProps: { ...MockStoresJSON, ...Variables },
      },
      {
        id: 107,
        componentName: 'Newsletter',
        componentProps: { ...MockNewsletterJSON },
      },
    ]
  }

  if (pageName === 'pdp') {
    data.pageData = [
      {
        id: 108,
        componentName: 'ProductDetails',
        componentProps: { ...MockProductDetailsJSON },
      },
      {
        id: 109,
        componentName: 'CrossSellingShelf',
        componentProps: { ...MockCrossSellingViewShelfJSON },
      },
      {
        id: 110,
        componentName: 'CrossSellingShelf',
        componentProps: { ...MockCrossSellingBuyShelfJSON },
      },
    ]
  }

  if (pageName === 'category') {
    data.pageData = [
      {
        id: 111,
        componentName: 'Bannergrid',
        componentProps: { ...MockBannergridJSON },
      },
      {
        id: 112,
        componentName: 'ProductGallery',
        componentProps: { ...MockProductGalleryJSON },
      },
      {
        id: 113,
        componentName: 'Banner',
        componentProps: { ...MockBannerJSON },
      },
    ]
  }

  if (pageName === 'search') {
    data.pageData = [
      {
        id: 114,
        componentName: 'ProductGallery',
        componentProps: { ...MockSearchResultProductGalleryJSON },
      },
    ]
  }

  if (pageName === 'wishlist') {
    data.pageData = [
      {
        id: 115,
        componentName: 'Wishlist',
        componentProps: { ...MockWishlistJSON },
      },
    ]
  }

  return data
}
