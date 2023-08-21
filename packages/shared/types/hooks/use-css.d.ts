export const defaultNamespace: 'dr' // = 'dr'
const statePrefix: 'is-'
export const fun = (a:string):string => {}
const _bem = (namespace: string, block: string, blockSuffix: string, element: string, modifier: string): string => {}

export const useNamespace = (
  block: string,
  namespaceOverrides?: string
) => {
  const namespace = defaultNamespace
  const b = (blockSuffix = '') =>
    _bem(namespace.value, block, blockSuffix, '', '')
  const e = (element) =>
    element ? _bem(namespace.value, block, '', element, '') : ''
  const m = (modifier) =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''
  const be = (blockSuffix, element) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''
  const em = (element, modifier) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''
  const bm = (blockSuffix, modifier) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix, element, modifier) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true
    return name && state ? `${statePrefix}${name}` : ''
  }
  // for css var
  // --dr-xxx: value;
  const cssVar = (object) => {
    return Object.keys(object).reduce((acc, key) => {
      if (object[key]) {
        acc[`--${namespace.value}-${key}`] = object[key]
      }
      return acc
    }, {})
  }
  const cssVarBlock = (object) => {
    return Object.keys(object).reduce((acc, key) => {
      if (object[key]) {
        acc[`--${namespace.value}-${block}-${key}`] = object[key]
      }
      return acc
    }, {})
  }
  const cssVarName = (name) => {
    return `--${namespace.value}-${name}`
  }
  const cssVarBlockName = (name) => {
    return `--${namespace.value}-${block}-${name}`
  }
  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    // css
    cssVar,
    cssVarBlock,
    cssVarName,
    cssVarBlockName
  }
}
