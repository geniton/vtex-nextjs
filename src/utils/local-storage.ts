export const getData = (key: string): any => {
  const data = localStorage.getItem(key)

  return data ? JSON.parse(data) : null
}

export const saveData = (key: string, data: any): any =>
  localStorage.setItem(key, JSON.stringify(data))

export default { getData, saveData }
