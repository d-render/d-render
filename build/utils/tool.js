export function getParamsFromCommand (argv) {
  console.log(argv)
  const item = {}
  let arr = []
  argv.forEach((v, k) => {
    if (k > 1) {
      arr = v.replace('--', '').split('=')
      item[arr[0]] = arr[1]
    }
  })
  return item
}
