/* eslint-disable no-console */
import React from 'react'
import Head from 'next/head'

import PublicDataJSON from 'src/public/data.json'
// import formatScripts from 'src/store-ui/src/utils/format-scripts'

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

        {/* {scripts?.length
          ? scripts.map(({ attrs, script }: any, index: number) => (
            <script key={index} {...attrs}>{`${script}`}</script>
          ))
          : null} */}
      </Head>
      {children || null}
    </>
  )
}

export default ThemeConfigs
