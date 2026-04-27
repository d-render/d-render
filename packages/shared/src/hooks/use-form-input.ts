import { computed, ref, watch, unref, SetupContext, Ref, WatchStopHandle, ComputedRef } from 'vue'
import { useElFormItemInject } from './use-form'
import {
  isEmpty,
  isNotEmpty,
  isObject,
  isArray,
  isNumber,
  getFieldValue,
  setFieldValue,
  getUsingConfig,
  type IRenderConfig,
  type IAnyObject,
  type ComposeType,
  type ExtendedConfig,
  depthFirstSearchTree2,
  debugWarn
} from '../utils'
import { getFormValueByTemplate, UpdateFormStream, InputProps } from '../helper'

type UseFormInputEmit = {
  (event: 'streamUpdate:model', val: unknown[]): void
  (event: 'update:modelValue', val: unknown): void
}
type UseFormInputContext = Pick<SetupContext, 'emit'> & {
  emit: UseFormInputEmit
}

type UseOptionsEmit = {
  (event: 'update:modelValue', val: unknown): void
}
type UseOptionsContext = Pick<SetupContext, 'emit'> & {
  emit: UseOptionsEmit
}

const useUpdateStream = (props: InputProps, context: UseFormInputContext) => {
  const updateStream = new UpdateFormStream(props, (val) => {
    context.emit('streamUpdate:model', val)
  })
  return updateStream
}

const useProxyOtherValue = (props: InputProps, maxOtherKey = 1, updateStream?: UpdateFormStream) => {
  const result = []
  for (let i = 0; i < maxOtherKey; i++) {
    const proxyValue = computed({
      get () {
        return props.values[i + 1]
      },
      set (val) {
        updateStream?.appendOtherValue(val, i + 1)
        updateStream?.end()
      }
    })
    result.push(proxyValue)
  }
  return result
}
function useFormBasicConfig <T extends keyof ComposeType = keyof ComposeType, V = unknown> (props: InputProps) {
  const securityConfig = computed(() => {
    return (props.config ?? {}) as ExtendedConfig<T, V>
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
export function useFormInput <T extends keyof ComposeType = keyof ComposeType, V = unknown> (props: InputProps, context: UseFormInputContext, { fromModelValue, toModelValue, maxOtherKey }: {

  fromModelValue?: (modelVal: unknown) => unknown
  toModelValue?: (value: unknown) => unknown
  maxOtherKey?: number
} = {}) {
  const inputRef = ref()
  const updateStream = useUpdateStream(props, context)
  const { securityConfig, clearable, width, placeholder, inputStyle, noMatchText } = useFormBasicConfig<T, V>(props)
  const emitInput = (val: unknown) => {
    emitModelValue(val)
  }
  const emitModelValue = (val: unknown) => {
    val = isNotEmpty(toModelValue) ? toModelValue!(val) : val
    // 同时支持2中修改方式，在formItem中不在接受update:modelValue
    context.emit('update:modelValue', val)
    updateStream.appendValue(val)
    updateStream.end()
  }

  // 组件单独使用时不在支持对otherValue的修改
  const emitOtherValue = (val: unknown) => {
    // context.emit('update:otherValue', val)
    updateStream.appendOtherValue(val)
    updateStream.end()
  }
  const proxyOtherValue = useProxyOtherValue(props, maxOtherKey, updateStream)
  const proxyValue = computed<V>({
    // 单值时使用
    get () {
      let modelValue = props.modelValue
      if (props.values && props.values.length > 0) {
        modelValue = props.values[0]
      }
      return (isNotEmpty(fromModelValue) ? fromModelValue!(modelValue) : modelValue) as V // props.modelValue
    },
    set (val) {
      emitModelValue(val)
    }
  })
  watch([() => securityConfig.value.defaultValue, () => props.changeCount], ([defaultValue]) => {
    // 处理函数形式的 defaultValue
    let actualDefaultValue = defaultValue
    if (typeof defaultValue === 'function') {
      try {
        actualDefaultValue = (defaultValue as () => V)()
      } catch (e) {
        console.error('defaultValue function execution error:', e)
        return
      }
    }

    if (props.showTemplate === true) {
      // 处于展示模版模式时，同步展示默认值【注：此模式仅在设计表单时开启】
      emitInput(actualDefaultValue)
    } else {
      // 处于实际值展示模式时, 需要modelValue 和defaultValue都不为空才进行值的更新
      if (isEmpty(props.modelValue) && isNotEmpty(actualDefaultValue)) {
        // emitInput(getValueByTemplate(defaultValue)) // date下需要转换值后再写入
        proxyValue.value = getFormValueByTemplate(actualDefaultValue as string) as V
      }
    }
  }, { immediate: true })

  // 处理 otherDefaultValue
  watch([() => securityConfig.value.otherDefaultValue, () => props.changeCount], ([otherDefaultValue]) => {
    if (!otherDefaultValue || maxOtherKey === 0) return

    // 处理函数形式的 otherDefaultValue
    let actualOtherDefaultValue: Array<unknown>
    if (typeof otherDefaultValue === 'function') {
      try {
        actualOtherDefaultValue = (otherDefaultValue as () => Array<unknown>)()
      } catch (e) {
        console.error('otherDefaultValue function execution error:', e)
        return
      }
    } else {
      actualOtherDefaultValue = otherDefaultValue
    }

    if (props.showTemplate === true) {
      // 处于展示模版模式时，同步展示默认值
      emitOtherValue(actualOtherDefaultValue)
    } else {
      // 处理实际值展示模式时, 需要 otherValue 为空才进行值的更新
      const otherValueEmpty = isEmpty(props.otherValue) ||
        (isObject(props.otherValue) && Object.keys(props.otherValue as object).length === 0)

      if (otherValueEmpty) {
        // 数组形式：对应 otherKey 数组
        // 将数组转换为对象，根据 otherKey 的顺序映射
        const otherKey = securityConfig.value.otherKey
        if (isArray(otherKey)) {
          const objValue = {} as IAnyObject
          ;(otherKey as string[]).forEach((key, index) => {
            if (actualOtherDefaultValue[index] !== undefined) {
              objValue[key] = actualOtherDefaultValue[index]
            }
          })
          emitOtherValue(objValue)
        } else if (otherKey && actualOtherDefaultValue[0] !== undefined) {
          // otherKey 是单个字符串，取数组第一个值
          emitOtherValue(actualOtherDefaultValue[0])
        }
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
export function useFormView <T extends keyof ComposeType = keyof ComposeType, V = unknown> (props: InputProps, { maxOtherKey }: {maxOtherKey?: number} = { }) {
  const { securityConfig, clearable, width, placeholder, inputStyle } = useFormBasicConfig<T, V>(props)
  const proxyOtherValue = useProxyOtherValue(props, maxOtherKey)
  return {
    securityConfig, clearable, width, inputStyle, placeholder, proxyOtherValue
  }
}
export const useElementFormEvent = () => {
  const elFormItem = useElFormItemInject()
  const handleChange = () => {
    // 2.2.17 修改为 elFormItem.validate
    // 2.2.x 使用 elFormItem.formItemMitt
    // console.log(elFormItem.validate())
    elFormItem.validate?.('change', () => {
      // console.log(args)
    })
    // elFormItem.formItemMitt?.emit('el.form.change', [val])
  }
  const handleBlur = () => {
    elFormItem.validate?.('blur', () => { })
    // elFormItem.formItemMitt?.emit('el.form.blur', [val])
  }
  return {
    handleChange,
    handleBlur
  }
}

const secureNewFn = (...params: string[]) => {
  const funcBody = params.pop()
  try {
    // eslint-disable-next-line no-new-func
    return new Function(...params, funcBody!)
  } catch (error) {
    console.error(error)
    return () => {}
  }
}
export const judgeUseFn = (key: string, config: IRenderConfig, effect?: Record<string, unknown>) => {
  // console.log(key, config, effect);
  // eslint-disable-next-line no-new-func
  if (key === 'changeValue' && config.changeValueStr) {
    return secureNewFn(
      'dependOnValues',
      'outDependOnValues',
      config.changeValueStr as string
    )
  }
  if (key === 'changeConfig' && config.changeConfigStr) {
    return secureNewFn(
      'config',
      'dependOnValues',
      'outDependOnValues',
      config.changeConfigStr as string
    )
  }
  if (key === 'asyncOptions' && typeof config.asyncOptions === 'string') {
    return secureNewFn('dependOnValues', 'outDependOnValues', config.asyncOptions as string)
  }
  if (!effect) return config[key as keyof ExtendedConfig] // 没有effect 参数则直接使用config[key]
  if (effect && key in effect) {
    // 有effect 且 effect对象明确存在key(不管其值为什么)
    if (typeof effect[key] === 'function') return effect[key] // effect中的值为函数 则认为此次响应使用局部方法
    return config[key as keyof ExtendedConfig]
  }
}
interface IOptionProps {
  label: string
  value: string
  children: string
  disabled: string
}

// view组件使用时，不需要updateStream和context
export const useOptions = (
  props: InputProps,
  multiple: Ref<boolean> | boolean,
  updateStream?: UpdateFormStream,
  context?: UseOptionsContext,
  { autoGet = true, isTree = false }: {autoGet?: boolean, isTree?: boolean} = {}
) => {
  const optionProps = computed<IOptionProps>(() => {
    // @ts-ignore
    return Object.assign({ label: 'label', value: 'value', children: 'children', disabled: 'disabled' }, props.config?.treeProps, props.config?.optionProps)
  })
  const getPathByValue = (options: IAnyObject[], value: unknown, optionProps: IOptionProps) => {
    return depthFirstSearchTree2(options, value, optionProps.value, optionProps.children)
  }
  // 根据value从options中获取option
  const getOptionByValue = (options: IAnyObject[], value: unknown, optionProps: IOptionProps) => {
    if (!isTree) {
      // 对象
      return options.find(v => v[optionProps.value] === value)
    } else {
      // 路径 depthFirstSearchTree2(options, value, optionProps.value, optionProps.children)
      const path = getPathByValue(options, value, optionProps)
      if (path) {
        return path[path.length - 1]
      }
    }
  }
  // 支持树选择, util的getLabelBayValue扩展而来故保留原始的入参顺序
  const getLabelByValue = (value: unknown, options: IAnyObject[], optionProps: IOptionProps) => {
    const option = getOptionByValue(options, value, optionProps)
    if (option) {
      return getFieldValue(option, optionProps.label)
    }
  }
  const otherKey = computed(() => {
    return props.config?.otherKey
  })
  const splitKey: ComputedRef<string> = computed(() => {
    // @ts-ignore
    return props.config?.splitKey as string ?? ','
  })
  const withObject = computed(() => {
    // @ts-ignore
    const value = props.config?.withObject
    value && debugWarn('d-render',
      `'config.withObject' is about to be deprecated in version 7.0.0, please change (config.otherKey: [labelKey]) to (config.otherKey: [labelKey,objectKey]).
`
    )
    // 传出的值是否为object
    return value ?? false
  })
  const realArray = computed(() => {
    // 需要返回的shu
    // @ts-ignore
    return props.config?.realArray ?? false
  })
  const options = ref([] as unknown[])
  let unwatch: WatchStopHandle|null = null
  // 计算option类型
  const isObjectOption = computed(() => {
    return isObject(options.value[0])
  })
  // 获取otherValue的值
  const getOtherValueByValue = (value: Array<string | number>) => {
    if (unref(multiple)) {
      if (withObject.value) {
        return value.map(i => {
          return (options.value as IAnyObject[])?.find(v => v[optionProps.value.value] === i) ?? {}
        })
      }
      return value.map(val => getLabelByValue(val, options.value as IAnyObject[], optionProps.value) ?? val).join(splitKey.value)
    } else {
      if (withObject.value) {
        return (options.value as IAnyObject[])?.find(v => v[optionProps.value.value] === value) ?? {}
      }
      return getLabelByValue(value, options.value as IAnyObject[], optionProps.value) ?? value
    }
  }
  const getValue = (modelValue: string | Array<unknown>) => {
    if (unref(multiple)) {
      // 防止空字符串导致的['']错误
      const modelArray = isArray(modelValue) ? modelValue : (modelValue ? (modelValue as string).split(splitKey.value) : [])
      // 如果option的value值是数字型将值转换为数字型，否则就是字符型
      // @ts-ignore
      const autoFormat = !(props.config?.multiple && props.config?.remote)
      if (autoFormat) {
        const optionCell = isObjectOption.value ? (options.value as IAnyObject[])[0]?.[optionProps.value.value] : options.value[0]
        if (isNumber(optionCell)) {
          return (modelArray as Array<string>).map(i => parseInt(i as string))
        } else {
          return (modelArray as Array<number|string>).map(i => String(i))
        }
      }
      return modelArray
    } else {
      return modelValue ?? ''
    }
  }
  const getModelValue = (value: unknown) => {
    if (unref(multiple)) {
      if (realArray.value) {
        return value
      } else {
        return isArray(value) ? (value as string[]).join(splitKey.value) : value
      }
    } else {
      return value
    }
  }
  // 根据otherValue跟随modelValue变化
  const getOtherValue = (modelValue: unknown, value: unknown) => {
    if (isObjectOption.value) {
      return getOtherValueByValue(value as Array<string|number>)
    } else {
      return modelValue
    }
  }

  // options部分组件重新定义proxyOptionsValue
  const proxyOptionsValue = computed({
    get () {
      return getValue(props.modelValue as string | unknown[])
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
            const checkOption = getOptionByValue((options.value as IAnyObject[]), value, optionProps.value)// (options.value as IAnyObject[]).find(v => v[optionProps.value.value] === value)
            updateStream.appendOtherValue(checkOption, 2)
          } else {
            // const checkOptions = (options.value as IAnyObject[]).filter(v => (value as unknown[]).includes(v[optionProps.value.value]))
            const checkOptions = (value as unknown[]).map(val => getOptionByValue((options.value as IAnyObject[]), val, optionProps.value))
            // TODO: 需要完成测试
            updateStream.appendOtherValue(checkOptions, 2)
          }
          if (isTree) {
            if (!unref(multiple)) {
              const path = getPathByValue(options.value as IAnyObject[], value, optionProps.value)
              updateStream.appendOtherValue(path, 3)
            } else {
              const paths = (value as unknown[]).map(val => getPathByValue(options.value as IAnyObject[], val, optionProps.value))
              updateStream.appendOtherValue(paths, 3)
            }
          }
        }
        updateStream.end()
      } else {
        console.error('updateStream 不存在，无法更新数据')
      }
    }
  })
  /**
   * 获取options
   * @param val 依赖数据
   * @param outVal 外部依赖数据（table外的数据，inTable为true时有效）
   * @param extra 额外参数（例：remoteMethod的第一个入参query，建议使用对象）
   */
  const getOptions = async (val?: IAnyObject, outVal?: IAnyObject, extra?: unknown) => {
    if (props.config.asyncOptions) {
      const asyncFunc = judgeUseFn('asyncOptions', props.config) as (val?: IAnyObject, outVal?: IAnyObject, extra?: unknown) => Promise<unknown[]>
      options.value = await asyncFunc(val, outVal, extra)
    } else {
      // @ts-ignore
      options.value = (props.config?.options as unknown[]) ?? []
    }
    if (unwatch) unwatch() // 获取一次options后重新开启监听
    unwatch = watch(() => props.changeCount, () => {
      // @ts-ignore
      if (isEmpty(props.modelValue) && props.config.autoSelect && updateStream) { // modelValue为空
        const result = (isObjectOption.value ? getFieldValue(options.value[0], optionProps.value.value) : options.value[0]) as string
        if (unref(multiple)) {
          proxyOptionsValue.value = [result]
        } else {
          proxyOptionsValue.value = result
        }
      }
    }, { immediate: true })
  }

  if (autoGet) {
    if (!(props.config.dependOn?.length) && !(props.config.outDependOn?.length)) {
      getOptions() // .then(() => { console.log('[init]: getOptions') })
      // @ts-ignore
      if (props.config.options) { // 动态表单设计时修改options需要触发此方法
        // @ts-ignore
        watch(() => props.config.options, () => {
          getOptions() // .then(() => { console.log('[config.options change]: getOptions') })
        })
      }
    } else {
      watch([() => props.dependOnValues, () => props.outDependOnValues], ([dependOnValues, outDependOnValues]) => {
        getOptions(dependOnValues || {}, outDependOnValues || {}) // .then(() => { console.log('[dependOn change]: getOptions') })
      }, { immediate: true })
    }
  }

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
export const useInputProps = (props: InputProps, propKeys: Array<string|[string, string]| [string, {key: string, defaultValue: unknown}]> = []) => {
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
            setKey = getUsingConfig(key[1].key, key[0]) as string // 只存在defaultValue配置时使用第一位key
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
