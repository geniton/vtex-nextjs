import { AudacityClientAPI } from 'src/utils/clients'

const statusConfig = {
  validateStatus: () => true,
}

export const getHeader = async () => {
  return AudacityClientAPI()
    .get('/header', statusConfig)
    .then((response) => response.data)
}

export const getFooter = async () => {
  return AudacityClientAPI()
    .get('/footer', statusConfig)
    .then((response) => response.data)
}

export const getPage = async (slug: string) => {
  return AudacityClientAPI()
    .get(slug, statusConfig)
    .then((response) => response.data)
}

export const getMenus = async () => {
  return AudacityClientAPI()
    .get('/menu', statusConfig)
    .then((response) => response.data)
}

export const getAllPageData = async (slug: string) => {
  return Promise.all([
    getHeader(),
    getFooter(),
    getMenus(),
    getPage(slug),
  ]).then(([header, footer, menus, pageData]) => ({
    header,
    footer,
    menus,
    pageData,
  }))
}
