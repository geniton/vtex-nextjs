import axios from 'axios'
import type { NextApiHandler } from 'next'

import storeConfig from 'store.config'

const subscribeNewsletter: NextApiHandler = async (request, response) => {
  if (request.method === 'POST') {
    const http = axios.create({
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': true,
        'x-vtex-api-appKey': process.env.VTEX_APP_KEY || '',
        'x-vtex-api-appToken': process.env.VTEX_APP_TOKEN || '',
      },
      method: 'POST',
    })

    try {
      const { acronym, ...payload } = JSON.parse(request.body)

      if (!acronym) {
        return response.status(400).json({
          message: 'acronym field empty',
        })
      }

      const { data: hasUser } = await http.get(
        `https://${storeConfig.api.storeId}.myvtex.com/api/dataentities/${acronym}/search?_where=email=${payload.email}&_fields=email`
      )

      if (hasUser?.length) {
        return response.status(200).json({
          message: 'registered user',
        })
      }

      const { data } = await http.post(
        `https://${storeConfig.api.storeId}.myvtex.com/api/dataentities/${acronym}/documents`,
        payload
      )

      return response.status(200).json({
        ...data,
        message: 'success',
      })
    } catch (error) {
      response.status(error.status).end(error.message)
    }
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method not allowed')
  }
}

export default subscribeNewsletter
