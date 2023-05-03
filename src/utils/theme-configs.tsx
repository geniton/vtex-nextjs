/* eslint-disable no-console */
import React from 'react'
import Head from 'next/head'

import PublicDataJSON from 'src/public/data.json'

interface PublicData {
  fonts: {
    [key: string]: {
      fontFamily: string
    }
  }
}

const ThemeConfigs: React.FC<any> = ({ children, data }) => {
  function getVariables() {
    const variables = []
    const publicData: PublicData = PublicDataJSON

    if (!data) return

    if (data.colors?.length) {
      data.colors.forEach(({ name, value }: any) => {
        variables.push(`--aud-${name}:${value};`)
      })
    }

    if (data.fontName && publicData.fonts[data.fontName]?.fontFamily) {
      variables.push(
        `--font-primary: ${publicData.fonts[data.fontName].fontFamily};`
      )
    }

    return `:root {${variables.join('')}}`
  }

  return (
    <>
      <Head>
        {
          <style type="text/css">
            {`
          ${getVariables()}
          ${data?.styleCustom}`}
          </style>
        }
      </Head>
      {children || null}
    </>
  )
}

export default ThemeConfigs
