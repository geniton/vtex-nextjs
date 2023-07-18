import type { NextApiHandler } from 'next'
import { AxiosError } from 'axios'
import { Services } from '@retailhub/audacity-vtex'

import storeConfig from 'store.config'

const Vtex: NextApiHandler = async (request, response) => {
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
