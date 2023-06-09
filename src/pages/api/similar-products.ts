import axios from 'axios'
import type { NextApiHandler } from 'next'

import storeConfig from 'store.config'

const SimilarProducts: NextApiHandler = async (request, response) => {
    const http = axios.create({
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': true,
        'x-vtex-api-appKey': process.env.VTEX_APP_KEY || '',
        'x-vtex-api-appToken': process.env.VTEX_APP_TOKEN || '',
      },
      method: 'POST',
      validateStatus: () => true
    })

    try {
      const { id } = request.query ?? {}

      const { data } = await http.get(`https://${storeConfig.api.storeId}.myvtex.com/api/catalog_system/pub/products/crossselling/similars/${id}`)

      return response.status(200).json({
        data,
        message: 'success',
      })
    } catch (error) {
      response.status(error.status).end(error.message)
    }
}

export default SimilarProducts
