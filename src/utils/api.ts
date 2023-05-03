/* eslint-disable no-console */
import axios from 'axios'

import { storeUrl } from 'store.config'
import { Utils } from '@retailhub/audacity'

export async function fetchData({ url, path, method, headers, data }: any) {
  const axiosConfig = {
    url: url ?? `${storeUrl}/${path}`,
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
    return fetchData({
      path: `/api/dataentities/WL/search?_where=userId=${userId}&_sort=createdIn DESC&_fields=userId,products`,
    })
      .then((res) => res.json())
      .then((res) => res)
  }

  if (userId) {
    getWishlistData().then((masterDataWishlist) => {
      const localWishlist = Utils.LocalStorage.getData('wishlist') || []

      let wishlistProducts: number[] = []

      if (masterDataWishlist?.length) {
        wishlistProducts = JSON.parse(masterDataWishlist[0].products).filter(
          (item: string) => /^[0-9\b]+$/.test(item)
        )
      }

      wishlistProducts = [...localWishlist, ...wishlistProducts]
      wishlistProducts = Array.from(new Set(wishlistProducts))

      Utils.LocalStorage.saveData('wishlist', wishlistProducts)
    })
  }
}

export async function getWishlist(userId: string) {
  return fetchData({
    path: `api/dataentities/WL/search?_where=userId=${userId}&_sort=createdIn DESC&_fields=userId,products`,
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
    path: `api/dataentities/${acronym}/documents`,
    data: payload,
    method: 'PUT',
  })
}

export default {
  fetchData,
  getWishlist,
  saveMasterData,
}
