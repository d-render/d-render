/**
 * 合并字段配置Map
 * @param targetConfigMap 待合并字段
 * @param sourceConfigMaps 合并字段源数组
 * @return {{}}
 */
import { cloneDeep, getFieldValue, isArray } from './util'
// configMapToList即mergeFieldConfig联合使用
export const generateFieldList = (...args) => configMapToList(mergeFieldConfig(...args))

export const mergeFieldConfig = (targetConfigMap, ...sourceConfigMaps) => {
  const result = {}
  Object.keys(targetConfigMap).forEach(key => {
    const targetConfig = targetConfigMap[key] || {}
    result[key] = getMergeConfig(key, targetConfig, sourceConfigMaps)
  })
  return result
}
/**
 * config 对象转为数组 (table时用的较多)
 * @param configMap
 * @return {{sort, config: *, key: string}[]}
 */
export const configMapToList = (configMap) => {
  return Object.keys(configMap).map((key, i) => {
    const config = configMap[key]
    key = config.realKey || key // realKey的优先级高于原本的key用于处理object相同的key智能有一个的问题
    return {
      key, // realKey的优先级高于key,
      config,
      sort: config.configSort || i
    }
  }).sort((a, b) => a.sort - b.sort)
}
/**
 * 将一个字段配置数据插入到另一个配置数据中
 * @param target
 * @param source
 * @returns {*}
 */
export const insertFieldConfigToList = (target = [], source) => {
  target = [...target] // 需要浅拷贝一次不然会导致值被修改的问题
  source.forEach(fieldConfig => {
    const { config: { insert } = {} } = fieldConfig
    if (insert) {
      // 需要开启排序 before 的优先级高于 after
      const offset = insert.before ? 0 : 1
      const anchorKey = insert.before || insert.after
      const anchorIndex = target.findIndex(tFieldConfig => tFieldConfig.key === anchorKey)
      target.splice(anchorIndex + offset, 0, fieldConfig)
    } else {
      target.push(fieldConfig)
    }
  })
  return target
}

export const configListToMap = (configList) => {
  const result = {}
  configList.forEach(({ key, config } = {}) => {
    if (key) {
      result[key] = config
    }
  })
  return result
}
const handlerDependOn = (dependOn, newDependOn, isMerge) => {
  if (dependOn && newDependOn) {
    const result = isMerge ? [...dependOn, ...newDependOn] : newDependOn
    return result.length > 0 ? result : undefined
  } else {
    return dependOn || newDependOn
  }
}
/**
 * 合并字段配置
 * @param key
 * @param targetConfig
 * @param sourceConfigMaps
 * @return {{}}
 */
function getMergeConfig (key, targetConfig, sourceConfigMaps) {
  let sourceConfig = {}
  const sourceKey = targetConfig.sourceKey || targetConfig.realKey || key
  let dependOn = []
  const isMergeDependOn = targetConfig.mergeDependOn === true
  if (sourceKey) {
    const sourceKeys = sourceKey.split('.')
    sourceConfigMaps.forEach((sourceConfigMap = {}) => {
      let sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKey])
      if (!sourceConfigNext && sourceKeys.length > 1) {
        sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKeys[0]])
        const preKey = [sourceKeys[0]]
        for (let i = 1; i < sourceKeys.length; i++) {
          if (!sourceConfigNext) break
          sourceConfigNext = getFieldConfig(sourceConfigNext[sourceKeys[i]], preKey.join('.'))
          preKey.push(sourceKeys[i]) // 最后一个key,舍弃
        }
      }
      dependOn = handlerDependOn(sourceConfig?.dependOn, sourceConfigNext?.dependOn, isMergeDependOn)
      sourceConfig = { ...sourceConfig, ...sourceConfigNext }
    })
  }
  /**
   * 合并逻辑
   */
  if (isMergeDependOn) {
    dependOn = handlerDependOn(dependOn, targetConfig.dependOn, true)
  } else {
    dependOn = targetConfig.dependOn || dependOn
  }
  return { ...sourceConfig, ...targetConfig, dependOn }
}

/**
 * 处理深层对象的副作用函数
 * @param fn
 * @param key
 * @param preKey
 * @return {(function(...[*]): *)|*}
 */
const handlerEffectFunction = (fn, key, preKey) => {
  // 如果fn不为函数返回原值
  if (typeof fn !== 'function') return fn
  if (key === 'changeConfig') {
    return (...args) => {
      return fn(args[0], getFieldValue(args[1], preKey) ?? {}, getFieldValue(args[2], preKey) ?? {})
    }
  }
  // 私有effect中无getOptionsFilter、asyncOptions
  if (['changeValue', 'asyncOptions', 'getOptionsFilter'].includes(key)) {
    return (...args) => {
      return fn(getFieldValue(args[0], preKey) ?? {}, getFieldValue(args[1], preKey) ?? {})
    }
  }
  // 如果key不符合上述条件返回原值
  return fn
}
/**
 * 获取字段配置（_renderConfig为数据定义时定义的字段渲染配置）
 * @param config
 * @return {{}|*}
 */
function getFieldConfig (config, preKey = '') {
  if (config?._renderConfig) {
    const _renderConfig = cloneDeep(config._renderConfig)
    if (preKey) {
      const dependOn = _renderConfig.dependOn
      if (dependOn?.length > 0) {
        _renderConfig.dependOn = dependOn.map(on => {
          if (typeof on === 'object') {
            const effect = handlerEffect(on.effect, preKey)
            return {
              key: `${preKey}.${on.key}`,
              effect
            }
          } else {
            return `${preKey}.${on}`
          }
        });
        // `${preKey}.${on}`
        ['changeConfig', 'changeValue', 'asyncOptions', 'getOptionsFilter'].forEach(key => {
          if (typeof _renderConfig[key] === 'function') {
            _renderConfig[key] = handlerEffectFunction(_renderConfig[key], key, preKey)
          }
        })
      }
      const otherKey = _renderConfig.otherKey
      if (typeof otherKey === 'string') {
        _renderConfig.otherKey = `${preKey}.${otherKey}`
      } else if (isArray(otherKey)) {
        _renderConfig.otherKey = otherKey.map(v => `${preKey}.${v}`)
      }
    }
    return _renderConfig
  } else {
    return config
  }
}

/**
 * 处理dependOn 为对象时的副作用配置
 * @param effect
 * @param preKey
 * @return {{}}
 */
function handlerEffect (effect, preKey) {
  const result = {}
  Object.keys(effect).forEach(key => {
    const item = effect[key]
    if (typeof item !== 'function') {
      result[key] = item
    } else {
      // 值为function
      result[key] = handlerEffectFunction(item, key, preKey)
    }
  })
  return result
}

export const keysToConfigMap = (keys) => {
  const configMap = {}
  keys.forEach(key => {
    let config = {}
    if (typeof key === 'object') {
      config = { ...key }
      key = key.key
      config.key = undefined
    }
    configMap[key] = config
  })
  return configMap
}

export const defineFieldConfig = (config) => config
// 为ts服务
// form配置
export const defineFormFieldConfig = (config) => config
// table配置
export const defineTableFieldConfig = (config) => config
// search-form配置
export const defineSearchFieldConfig = (config) => config
