import type { NextApiHandler } from 'next'
import { AxiosError } from 'axios'
import { Services } from '@retailhub/audacity-vtex'

import storeConfig from 'store.config'

const Vtex: NextApiHandler = async (request, response) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    return Services.Vtex.VtexApiHandler(request, response, {
      store: storeConfig.api.storeId,
      appKey: process.env.VTEX_APP_KEY,
      appToken: process.env.VTEX_APP_TOKEN,
    })
  } catch (error) {
    const errorData = new AxiosError(error)
      ? error.response?.data
      : (error as Error)?.message

    return response.status(400).send({
      success: false,
      error: errorData,
    })
  }
}

export default Vtex
