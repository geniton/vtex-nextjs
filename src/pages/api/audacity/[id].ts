import type { NextApiHandler } from 'next'
import { AxiosError } from 'axios'
import { Services } from '@retailhub/audacity-vtex'

const Audacity: NextApiHandler = async (request, response) => {
  try {
    return Services.Audacity(request, response, process.env)
  } catch (error) {
    console.log(error)
    const errorData = new AxiosError(error)
      ? error.response?.data
      : (error as Error)?.message

    return response.status(400).send({
      success: false,
      error: errorData,
    })
  }
}

export default Audacity
