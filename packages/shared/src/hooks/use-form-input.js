import { computed, ref, watch, unref } from 'vue'
import { useElFormItemInject } from './use-form'
import {
  isEmpty,
  isNotEmpty,
  getLabelByValue,
  isObject,
  isArray,
  isNumber, getFieldValue, setFieldValue, getUsingConfig
} from '../utils'
import { getFormValueByTemplate, UpdateFormStream } from '../helper'

const useUpdateStream = (props, context) => {
  const updateStream = new UpdateFormStream(props, (val) => {
    context.emit('streamUpdate:model', val)
  })
  return updateStream
}

const useProxyOtherValue = (props, maxOtherKey = 1, updateStream) => {
  const result = []
  for (let i = 0; i < maxOtherKey; i++) {
    const proxyValue = computed({
      get () {
        return props.values[i + 1]
      },
      set (val) {
        updateStream.appendOtherValue(val, i + 1)
        updateStream.end()
      }
    })
    result.push(proxyValue)
  }
  return result
}
const useFormBasicConfig = (props) => {
  const securityConfig = computed(() => {
    return props.config ?? {}
  })
  const clearable = computed(() => {
    return securityConfig.value.clearable ?? true
  })
  const width = computed(() => {
    return securityConfig.value.width ?? '100%'
  })
  const inputStyle = computed(() => {
    return securityConfig.value.inputStyle ?? {}
  })
  const placeholder = computed(() => {
    return securityConfig.value.placeholder
  })
  const noMatchText = computed(() => {
    return securityConfig.value.noMatchText ?? '无相关内容'
  })
  return {
    securityConfig, clearable, width, placeholder, inputStyle, noMatchText
  }
}
export const useFormInput = (props, context, { fromModelValue, toModelValue, maxOtherKey } = {}) => {
  const inputRef = ref()
  const updateStream = useUpdateStream(props, context)
  const { securityConfig, clearable, width, placeholder, inputStyle, noMatchText } = useFormBasicConfig(props)
  const emitInput = (val) => {
    emitModelValue(val)
  }
  const emitModelValue = (val) => {
    val = isNotEmpty(toModelValue) ? toModelValue(val) : val
    // 同时支持2中修改方式，在formItem中不在接受update:modelValue
    context.emit('update:modelValue', val)
    updateStream.appendValue(val)
    updateStream.end()
  }

  // 组件单独使用时不在支持对otherValue的修改
  const emitOtherValue = (val) => {
    // context.emit('update:otherValue', val)
    updateStream.appendOtherValue(val)
    updateStream.end()
  }
  const proxyOtherValue = useProxyOtherValue(props, maxOtherKey, updateStream)
  const proxyValue = computed({
    // 单值时使用
    get () {
      let modelValue = props.modelValue
      if (props.values && props.values.length > 0) {
        modelValue = props.values[0]
      }
      return isNotEmpty(fromModelValue) ? fromModelValue(modelValue) : modelValue // props.modelValue
    },
    set (val) {
      emitModelValue(val)
    }
  })
  watch([() => securityConfig.value.defaultValue, () => props.changeCount], ([defaultValue]) => {
    if (props.showTemplate === true) {
      // 处于展示模版模式时，同步展示默认值【注：此模式仅在设计表单时开启】
      emitInput(defaultValue)
    } else {
      // 处于实际值展示模式时, 需要modelValue 和defaultValue都不为空才进行值的更新
      if (isEmpty(props.modelValue) && isNotEmpty(defaultValue)) {
        // emitInput(getValueByTemplate(defaultValue)) // date下需要转换值后再写入
        proxyValue.value = getFormValueByTemplate(defaultValue)
      }
    }
  }, { immediate: true })

  return {
    inputRef,
    inputStyle,
    proxyValue,
    securityConfig,
    emitInput,
    emitModelValue,
    emitOtherValue,
    updateStream,
    proxyOtherValue,
    placeholder,
    clearable,
    width,
    noMatchText
  }
}
export const useFormView = (props, { maxOtherKey } = {}) => {
  const { securityConfig, clearable, width, placeholder, inputStyle } = useFormBasicConfig(props)
  const proxyOtherValue = useProxyOtherValue(props, maxOtherKey, () => { })
  return {
    securityConfig, clearable, width, inputStyle, placeholder, proxyOtherValue
  }
}
export const useElementFormEvent = () => {
  const elFormItem = useElFormItemInject()
  const handleChange = (val) => {
    // 2.2.17 修改为 elFormItem.validate
    // 2.2.x 使用 elFormItem.formItemMitt
    // console.log(elFormItem.validate())
    elFormItem.validate?.('change', () => {
      // console.log(args)
    })
    // elFormItem.formItemMitt?.emit('el.form.change', [val])
  }
  const handleBlur = (val) => {
    elFormItem.validate?.('blur', () => { })
    // elFormItem.formItemMitt?.emit('el.form.blur', [val])
  }
  return {
    handleChange,
    handleBlur
  }
}

const secureNewFn = (...params) => {
  const funcBody = params.pop()
  try {
    // eslint-disable-next-line no-new-func
    return new Function(...params, funcBody)
  } catch (error) {
    console.error(error)
    return () => {}
  }
}
export const judgeUseFn = (key, config, effect) => {
  // console.log(key, config, effect);
  // eslint-disable-next-line no-new-func
  if (key === 'changeValue' && config.changeValueStr) {
    return secureNewFn(
      'dependOnValues',
      'outDependOnValues',
      config.changeValueStr
    )
  }
  if (key === 'changeConfig' && config.changeConfigStr) {
    return secureNewFn(
      'config',
      'dependOnValues',
      'outDependOnValues',
      config.changeConfigStr
    )
  }
  if (key === 'asyncOptions' && typeof config.asyncOptions === 'string') { return secureNewFn('dependOnValues', 'outDependOnValues', config.asyncOptions) }
  if (!effect) return config[key] // 没有effect 参数则直接使用config[key]
  if (effect && key in effect) {
    // 有effect 且 effect对象明确存在key(不管其值为什么)
    if (typeof effect[key] === 'function') return effect[key] // effect中的值为函数 则认为此次响应使用局部方法
    return config[key]
  }
}

export const useOptions = (props, multiple, updateStream, context, { autoGet = true } = {}) => {
  const optionProps = computed(() => {
    return Object.assign({ label: 'label', value: 'value', children: 'children' }, props.config?.treeProps, props.config?.optionProps)
  })
  const otherKey = computed(() => {
    return props.config?.otherKey
  })
  const splitKey = computed(() => {
    return props.config?.splitKey ?? ','
  })
  const withObject = computed(() => {
    // 传出的值是否为object
    return props.config?.withObject ?? false
  })
  const realArray = computed(() => {
    // 需要返回的shu
    return props.config?.realArray ?? false
  })
  const options = ref([])
  let unwatch = null
  const getOptions = async (val, outVal) => {
    if (props.config.asyncOptions) {
      const asyncFunc = judgeUseFn('asyncOptions', props.config)
      options.value = await asyncFunc(val, outVal)
    } else {
      options.value = props.config?.options ?? []
    }
    if (unwatch) unwatch() // 获取一次options后重新开启监听
    unwatch = watch(() => props.changeCount, () => {
      if (isEmpty(props.modelValue) && props.config.autoSelect && updateStream) { // modelValue为空
        const autoValue = isObjectOption.value ? options.value[0][optionProps.value.value] : options.value[0]
        const autoLabel = isObjectOption.value ? options.value[0][optionProps.value.label] : options.value[0]
        // eslint-disable-next-line no-unused-expressions
        // emitInput(autoValue)
        // emitOtherValue && emitOtherValue(autoLabel)
        updateStream.appendValue(autoValue)
        updateStream.appendOtherValue(autoLabel)
        updateStream.end()
      }
    }, { immediate: true })
  }
  // 计算option类型
  const isObjectOption = computed(() => {
    return isObject(options.value[0])
  })
  // 获取otherValue的值
  const getOtherValueByValue = (value) => {
    if (unref(multiple)) {
      if (withObject.value) {
        return value.map(i => {
          return options.value?.find(v => v[optionProps.value.value] === i) ?? {}
        })
      }
      return value.map(val => getLabelByValue(val, options.value, optionProps.value) ?? val).join(splitKey.value)
    } else {
      if (withObject.value) {
        return options.value?.find(v => v[optionProps.value.value] === value) ?? {}
      }
      return getLabelByValue(value, options.value, optionProps.value) ?? value
    }
  }
  const getValue = (modelValue) => {
    if (unref(multiple)) {
      // 防止空字符串导致的['']错误
      const modelArray = isArray(modelValue) ? modelValue : (modelValue ? modelValue.split(splitKey.value) : [])
      // 如果option的value值是数字型将值转换为数字型，否则就是字符型
      const autoFormat = !(props.config?.multiple && props.config?.remote)
      if (autoFormat) {
        const optionCell = isObjectOption.value ? options.value[0]?.[optionProps.value.value] : options.value[0]
        if (isNumber(optionCell)) {
          return modelArray.map(i => parseInt(i))
        } else {
          return modelArray.map(i => String(i))
        }
      }
      return modelArray
    } else {
      return modelValue ?? ''
    }
  }
  const getModelValue = (value) => {
    if (unref(multiple)) {
      if (realArray.value) {
        return value
      } else {
        return isArray(value) ? value.join(splitKey.value) : value
      }
    } else {
      return value
    }
  }
  // 根据otherValue跟随modelValue变化
  const getOtherValue = (modelValue, value) => {
    if (isObjectOption.value) {
      return getOtherValueByValue(value)
    } else {
      return modelValue
    }
  }
  if (autoGet) {
    if (!(props.config.dependOn?.length) && !(props.config.outDependOn?.length)) {
      getOptions() // .then(() => { console.log('[init]: getOptions') })
      if (props.config.options) { // 动态表单设计时修改options需要触发此方法
        watch(() => props.config.options, (val) => {
          getOptions() // .then(() => { console.log('[config.options change]: getOptions') })
        })
      }
    } else {
      watch([() => props.dependOnValues, () => props.outDependOnValues], ([dependOnValues, outDependOnValues]) => {
        getOptions(dependOnValues || {}, outDependOnValues || {}) // .then(() => { console.log('[dependOn change]: getOptions') })
      }, { immediate: true })
    }
  }
  // options部分组件重新定义proxyOptionsValue
  const proxyOptionsValue = computed({
    get () {
      return getValue(props.modelValue)
    },
    set (value) {
      const modelValue = getModelValue(value)
      if (context) {
        context.emit('update:modelValue', modelValue)
      }
      if (updateStream) {
        updateStream.appendValue(modelValue)
        if (otherKey.value) {
          const otherValue = getOtherValue(modelValue, value)
          // context.emit('update:otherValue', otherValue)
          updateStream.appendOtherValue(otherValue)
          // 目前仅支持单选
          if (!unref(multiple)) {
            const checkOption = options.value.find(v => v[optionProps.value.value] === value)
            updateStream.appendOtherValue(checkOption, 2)
          } else {
            const checkOptions = options.value.filter(v => value.includes(v[optionProps.value.value]))
            updateStream.appendOtherValue(checkOptions, 2)
          }
        }
        updateStream.end()
      } else {
        console.error('updateStream 不存在，无法更新数据')
      }
    }
  })
  return {
    optionProps,
    options,
    getOptions,
    isObjectOption,
    getValue,
    getModelValue,
    getOtherValue,
    splitKey,
    proxyOptionsValue
  }
}
/**
 * 从props.config去除制定的值
 * propKeys事例：
 *  [
 *    'a',  获取A
 *    ['b','b1'], 获取b的值转为b1
 *    ['c',{key:'c1', defaultValue: 1}], 获取c的值转为c1若c的值不存在则赋值1
 *    ['d',{ defaultValue: 1}] 获取d的若d不存在则赋值1
 *  ]
 * @param props
 * @param propKeys
 *
 */
export const useInputProps = (props, propKeys = []) => {
  return computed(() => {
    const config = props.config || {}
    return propKeys.reduce((acc, key) => {
      if (typeof key !== 'string') {
        const getKey = key[0]
        let setKey = key[0]
        let defaultValue
        if (isNotEmpty(key[1])) {
          if (typeof key[1] === 'string') {
            setKey = key[1]
          } else {
            setKey = getUsingConfig(key[1].key, key[0]) // 只存在defaultValue配置时使用第一位key
            defaultValue = key[1].defaultValue
          }
        }
        const propValue = getFieldValue(config, getKey)
        setFieldValue(acc, setKey, getUsingConfig(propValue, defaultValue))
      } else {
        const propValue = getFieldValue(config, key)
        setFieldValue(acc, key, propValue)
      }
      return acc
    }, {}) || {}
  })
}
