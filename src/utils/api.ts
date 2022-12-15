/* eslint-disable no-console */
import axios from 'axios'

import storeConfig, { storeUrl } from 'store.config'
import * as LocalStorage from 'src/utils/local-storage'

export async function fetchData({ url, method, headers, data }: any) {
  const axiosConfig = {
    url: `${storeUrl}/${url}`,
    method: method ?? 'get',
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
    data: JSON.stringify(data) ?? null,
  }

  const response = await axios(axiosConfig)

  return response.data
}

export async function updateWishlist(userId?: string) {
  async function getWishlistData() {
    return fetch(
      `${storeConfig.storeUrl}/api/dataentities/WL/search?_where=userId=${userId}&_sort=createdIn DESC&_fields=userId,products`
    )
      .then((res) => res.json())
      .then((res) => res)
  }

  if (userId) {
    getWishlistData().then((masterDataWishlist) => {
      const localWishlist = LocalStorage.getData('wishlist') || []

      let wishlistProducts: number[] = []

      if (masterDataWishlist?.length) {
        wishlistProducts = JSON.parse(masterDataWishlist[0].products).filter(
          (item: string) => /^[0-9\b]+$/.test(item)
        )
      }

      wishlistProducts = [...localWishlist, ...wishlistProducts]
      wishlistProducts = Array.from(new Set(wishlistProducts))

      LocalStorage.saveData('wishlist', wishlistProducts)
    })
  }
}

export async function getWishlist(userId: string) {
  return fetchData({
    url: `api/dataentities/WL/search?_where=userId=${userId}&_sort=createdIn DESC&_fields=userId,products`,
    headers: {
      'x-vtex-api-appKey': 'vtexappkey-retailhub-UYRTYS',
      'x-vtex-api-appToken':
        'DNDCHMZBQIYCBINPLTTLOQASNUAGJEDIJJZQMQRICPTCVSPKFAJVMFENNKONLSSMFQSRJXDVBLIYWXWVFQBIUHVEFLCBBEWKWHWFZXAHXOTBWFQPOTHVQKRXUNLXUBTX',
    },
  })
}

export async function saveMasterData(data: any) {
  const { acronym, ...payload } = data

  return fetchData({
    url: `api/dataentities/${acronym}/documents`,
    data: payload,
    method: 'PUT',
  })
}

export async function getCMSpage(page: string) {
  return fetch(
    `https://lkz4u1i0x8.execute-api.us-east-1.amazonaws.com/api/page/${page}`
  ).then((res) => res.json())
}

export default {
  fetchData,
  getWishlist,
  saveMasterData,
  getCMSpage,
}
