import axios from 'axios'

import Variables from 'config/variables.json'

export const AudacityClientAPI = () => {
  const instance = axios.create({
    baseURL: Variables.audacityAPI,
    headers: {
      'audacity-token': Variables.audacityToken,
    },
  })

  return instance
}
