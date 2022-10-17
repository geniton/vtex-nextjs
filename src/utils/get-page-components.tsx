import { Components } from '@retailhub/audacity-ui'
import Variables from 'config/variables.json'
import MockBannerJSON from 'data/components/banner.json'
import MockShowcaseJSON from 'data/components/showcase.json'
import MockTipbarJSON from 'data/components/tipbar.json'
import MockNewsletterJSON from 'data/components/newsletter.json'
import MockCountdownJSON from 'data/components/countdown.json'
import MockStoresJSON from 'data/components/stores.json'
import MockAccordionJSON from 'data/components/accordion.json'
import header from 'data/components/header.json'
import footer from 'data/components/footer.json'
import themeConfigs from 'data/components/theme-configs.json'

export default function getPageComponents() {
return {
  themeConfigs,
  header,
  footer,
  pageData: [
    {
      id: 105,
      title: 'Countdown',
      Component: Components.Countdown,
      componentProps: {...MockCountdownJSON},
    },
    {
      id: 101,
      title: 'Banner',
      Component: Components.Banner,
      componentProps: {...MockBannerJSON},
    },
    {
      id: 102,
      title: 'Vitrine',
      Component: Components.Showcase,
      componentProps: {...MockShowcaseJSON, ...Variables},
    },
    {
      id: 103,
      title: 'Tipbar',
      Component: Components.Tipbar,
      componentProps: {...MockTipbarJSON},
    },
    {
      id: 102,
      title: 'Vitrine',
      Component: Components.Showcase,
      componentProps: {...MockShowcaseJSON, ...Variables},
    },
    {
      id: 106,
      title: 'Stores',
      Component: Components.Stores,
      componentProps: {...MockStoresJSON, ...Variables},
    },
    {
      id: 107,
      title: 'Accordion',
      Component: Components.Accordion,
      componentProps: {...MockAccordionJSON},
    },
    {
      id: 104,
      title: 'Newsletter',
      Component: Components.Newsletter,
      componentProps: {...MockNewsletterJSON},
    },
  ]
}
}
