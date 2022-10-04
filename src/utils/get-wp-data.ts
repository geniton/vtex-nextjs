import { api } from '../services/api'

export default async function getWpData(pathSlug = '') {
  const header = api.get(`/option/header`).then(({ data }) => ({ data, name: 'header' }))
  const footer = api.get(`/option/footer`).then(({ data }) => ({ data, name: 'footer' }))
  const themeConfigs = api.get(`/option/theme-configs`).then(({ data }) => ({ data, name: 'themeConfigs' }))
  const page = api.get(pathSlug).then(({ data }) => ({ data, name: 'pageData' }))
  return Promise.all([page, header, footer, themeConfigs]).then(res => {
    const data: any = {}

    for (let a = 0; a < res.length; a++) {
      data[res[a].name] = res[a].data
    }
    return data
  })
}
