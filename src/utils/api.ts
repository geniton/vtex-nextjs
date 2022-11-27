/* eslint-disable no-console */
import axios from 'axios'

import { storeUrl } from 'store.config'

export async function fetchData(
  url: string,
  data?: any,
  headers?: any,
  method: any = 'get'
) {
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

export async function getWishlist(userId: string) {
  return fetchData(
    `api/dataentities/WL/search?_where=userId=${userId}&_sort=createdIn DESC&_fields=userId,products`,
    null,
    {
      'x-vtex-api-appkey': 'vtexappkey-retailhub-UYRTYS',
      'x-vtex-api-apptoken':
        'DNDCHMZBQIYCBINPLTTLOQASNUAGJEDIJJZQMQRICPTCVSPKFAJVMFENNKONLSSMFQSRJXDVBLIYWXWVFQBIUHVEFLCBBEWKWHWFZXAHXOTBWFQPOTHVQKRXUNLXUBTX',
    }
  )
}

export async function saveMasterData(data: any) {
  const { acronym, ...payload } = data

  return fetchData(`/api/dataentities/${acronym}/documents`, payload, 'PUT')
}

export default {
  fetchData,
  getWishlist,
  saveMasterData,
}
