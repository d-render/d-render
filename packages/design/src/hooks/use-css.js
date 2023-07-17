export const defaultNamespace = 'dr'

const _bem = (namespace, block, blockSuffix, element, modifier) => {
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
  block,
  namespaceOverrides
) => {
  const namespace = defaultNamespace
  const b = (blockSuffix = '') => {
    _bem(namespace.value, block, blockSuffix, '', '')
  }
  const cls = `${namespace},`
  const cssVar = () => {}
  const cssVarBlock = () => {}
  const cssVarName = () => {

  }
  const cssVarBlockName = () => {

  }
  return {
    b
  }
}
