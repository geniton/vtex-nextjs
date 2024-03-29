export function arrayMove(
  arr: any[],
  old_index: number,
  new_index: number
): any {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1

    while (k--) {
      arr.push(undefined)
    }
  }

  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])

  return arr
}
