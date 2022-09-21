/* eslint-disable no-console */
import React from 'react'
import Head from 'next/head';

import PublicDataJSON from 'src/public/data.json'
import formatScripts from 'src/store-ui/src/utils/format-scripts'

const ThemeConfigs: React.FC<any> = ({ children, data }) => {
  function getVariables() {
    const variables = []

    if (!data) return

    if (data.mainColors && !!Object.values(data.mainColors).length) {
      for (const variable in data.mainColors) {
        variables.push(`--${variable}:${data.mainColors[variable]};`)
      }
    }

    if (data.themeColors?.length) {
      data.themeColors.forEach(({ name, color }: any) => {
        variables.push(`--${name}:${color};`)
      })
    }

    if (data.fontName && PublicDataJSON.fonts[data.fontName]?.fontFamily) {
      variables.push(`--font-primary: ${PublicDataJSON.fonts[data.fontName].fontFamily};`)
    }

    return `:root {${variables.join('')}}`
  }

  const scripts = formatScripts(data?.scripts) || []

  return (
    <>
      <Head>
        {<style type="text/css">{`
          ${getVariables()}
          ${data?.styleCustom}`}
        </style>}

        {scripts?.length
          ? scripts.map(({ attrs, script }: any, index: number) => (
            <script key={index} {...attrs}>{`${script}`}</script>
          ))
          : null}
      </Head>
      {children || null}
    </>
  )
}

export default ThemeConfigs
