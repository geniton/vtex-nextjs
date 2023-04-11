import axios from 'axios'
import type { NextApiHandler } from 'next'

import Variables from 'config/variables.json'
import storeConfig from 'store.config'

const wishlist: NextApiHandler = async (request, response) => {
  const headers = {
    'x-vtex-api-appKey': Variables.vtexKey,
    'x-vtex-api-appToken': Variables.vtexToken,
  }

  if (request.method === 'GET') {
    const http = axios.create({
      headers,
      method: 'get',
    })

    try {
      const { query }: any = request
      const params = new URLSearchParams(query)

      const url = [
        `https://${storeConfig.api.storeId}.myvtex.com/api/dataentities/WL/search`,
      ]

      if (params.toString()) {
        url.push(params.toString())
      }

      const { data } = await http.get(url.join('?'))

      return response.status(200).json({
        data,
        message: 'success',
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (request.method === 'PUT') {
    const http = axios.create({
      headers,
      method: 'PUT',
    })

    try {
      const payload = request.body

      const { data } = await http.put(
        `https://${storeConfig.api.storeId}.myvtex.com/api/dataentities/WL/documents`,
        payload
      )

      return response.status(200).json({
        data,
        message: 'success',
      })
    } catch (error) {
      console.log(error)
    }
  }

  response.setHeader('Allow', 'POST')
  response.status(405).end('Method not allowed')
}

export default wishlist
