import axios from 'axios'
import type { NextApiHandler } from 'next'

import storeConfig from 'store.config'

const wishlist: NextApiHandler = async (request, response) => {
  if (request.method === 'GET') {
    const http = axios.create({
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': true,
        'x-vtex-api-appKey': 'vtexappkey-retailhub-UYRTYS',
        'x-vtex-api-appToken':
          'DNDCHMZBQIYCBINPLTTLOQASNUAGJEDIJJZQMQRICPTCVSPKFAJVMFENNKONLSSMFQSRJXDVBLIYWXWVFQBIUHVEFLCBBEWKWHWFZXAHXOTBWFQPOTHVQKRXUNLXUBTX',
      },
      method: 'GET',
    })

    try {
      const { query }: any = request
      const params = new URLSearchParams(query)

      const url = [
        `https://${storeConfig.api.storeId}.vtexcommercestable.com.br/api/dataentities/WL/search`,
      ]

      if (params.toString()) {
        url.push(params.toString())
      }

      const { data } = await http.get(url.join(''))

      return response.status(200).json({
        ...data,
        message: 'success',
      })
    } catch (error) {
      response.status(error).end(error)
    }
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method not allowed')
  }
}

export default wishlist
