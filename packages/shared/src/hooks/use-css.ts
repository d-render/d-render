import { computed } from 'vue'

export const defaultNamespace = 'dr'
const statePrefix = 'is-'
const _bem = (namespace: string, block: string, blockSuffix: string, element: string, modifier: string) => {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export const useNamespace = (
  block: string
) => {
  const namespace = computed(() => defaultNamespace)
  const b = (blockSuffix = '') =>
    _bem(namespace.value, block, blockSuffix, '', '')
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, '', element, '') : ''
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''
  const is = (name?: string, ...args: unknown[]) => {
    const state = args.length >= 1 ? args[0] : true
    return name && state ? `${statePrefix}${name}` : ''
  }
  // for css var
  // --dr-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    return Object.keys(object).reduce((acc: Record<string, string>, key) => {
      if (object[key]) {
        acc[`--${namespace.value}-${key}`] = object[key]
      }
      return acc
    }, {})
  }
  const cssVarBlock = (object: Record<string, string>) => {
    return Object.keys(object).reduce((acc: Record<string, string>, key) => {
      if (object[key]) {
        acc[`--${namespace.value}-${block}-${key}`] = object[key]
      }
      return acc
    }, {})
  }
  const cssVarName = (name: string) => {
    return `--${namespace.value}-${name}`
  }
  const cssVarBlockName = (name: string) => {
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
