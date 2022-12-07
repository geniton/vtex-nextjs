import React from 'react'

type Props = {
  active?: boolean
  color?: string
  width?: string
  height?: string
}

const HeartIcon: React.FC<Props> = ({
  active,
  color,
  width = '18',
  height = '17',
  ...otherProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 26.059 23.821"
      color={color || 'var(--primary)'}
      fill={active ? color || 'var(--primary)' : 'transparent'}
      {...otherProps}
    >
      <path
        d="M1221.828,73.057a.745.745,0,0,0,1.229.01,6.481,6.481,0,0,1,5.386-2.923c3.615,0,6.219,3.093,6.547,6.78a6.725,6.725,0,0,1-.212,2.562,11.336,11.336,0,0,1-3.453,5.759l-8.374,7.472a.761.761,0,0,1-1.016,0l-8.228-7.469a11.328,11.328,0,0,1-3.453-5.758,6.738,6.738,0,0,1-.213-2.563c.328-3.686,2.932-6.78,6.547-6.78A6.193,6.193,0,0,1,1221.828,73.057Z"
        transform="translate(-1209.486 -69.643)"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="1"
      ></path>
    </svg>
  )
}

export default HeartIcon
