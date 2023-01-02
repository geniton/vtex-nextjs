import header from 'data/components/header.json'
import footer from 'data/components/footer.json'
import themeConfigs from 'data/components/theme-configs.json'
import MockProductDetailsJSON from 'data/components/product-details.json'
// import MockBannergridJSON from 'data/components/bannergrid.json'
import MockCrossSellingViewShelfJSON from 'data/components/cross-selling-shelf-view.json'
import MockCrossSellingBuyShelfJSON from 'data/components/cross-selling-shelf-buy.json'
import MockSearchResultProductGalleryJSON from 'data/components/search-result-product-gallery.json'
import MockProducts from 'data/components/products.json'
import MockWishlistJSON from 'data/components/wishlist.json'

export default function getPageComponents(pageName?: string) {
  const data: any = {
    themeConfigs,
    header,
    footer,
    pageData: [],
  }

  if (pageName === 'products') {
    data.pageData = [
      {
        id: 101,
        component: 'Products',
        componentData: { ...MockProducts },
      }
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
