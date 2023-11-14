import type { Slot, CSSProperties, VNode } from 'vue'
import type { IAnyObject } from './util'
/**
 * 合并字段配置Map
 * @param targetConfigMap 待合并字段
 * @param sourceConfigMaps 合并字段源数组
 * @return {{}}
 */
import { cloneDeep, getFieldValue, isArray } from './util'
import type { FormItemRule } from 'element-plus'
// eslint-disable-next-line no-use-before-define
type TChangeConfig = (config: IRenderConfig, values: IAnyObject, outValues: IAnyObject)=> IRenderConfig

type TChangeValue = (values: IAnyObject, outValues: IAnyObject) => { value: IAnyObject, otherValue: IAnyObject } | void
type TChangeValueByOld = (
  { key, oldValue }:{key:string, oldValue: unknown},
  values: IAnyObject, outValues: IAnyObject
) => { value: unknown, otherValue: unknown } | void

type TInsert = {before: string, after?: string} | { before?: string, after: string }

export interface IRenderConfigDependOnEffect {
  changeValue: boolean | TChangeValue
  changeConfig: boolean | TChangeConfig
  [propname: string]: boolean | unknown
}
export interface IRenderConfigDependOn {
  key: string
  effect?: (IRenderConfigDependOnEffect & {[propname: string]: unknown}) | boolean
}
// base
export interface IRenderConfig{
  ruleKey?: string,
  sourceKey?: string,
  realKey?: string,
  mergeDependOn?: boolean
  /**
   * 组件类型
   */
  type?: string
  /**
   * 表单项label文案展示
   */
  label?: string
  /**
   * 表单项宽度
   */
  width?: number | string
  /**
   * 当前表单项的依赖项（依赖项为当前表单的其他表单key），配置后，可在依赖项发生改变时，修改当前表单项的值或配置。
   * 修改配置 - {@link changeConfig}；
   * 修改值 - {@link changeValue}；
   */
  dependOn?: Array<string|IRenderConfigDependOn>
  outDependOn?: Array<string>
  /**
   * 当前表单项的另一个key，在部分表单组件会抛出另一个值，抛出的值会被当前配置的otherKey接收
   */
  otherKey?: string | Array<string>
  /**
   * 当前表单项是否可编辑
   */
  writable?: boolean
  /**
   * 当前表单项是否可读
   */
  readable?: boolean
  /**
   * 是否可禁用当前表单项
   */
  disabled?: boolean
  configSort?: number
  importDisabled?: boolean
  /**
   * 修改当前表单项的配置，受{@link dependOn} 配置影响，会在dependOn的值发生修改时触发
   * @param  {IRenderConfig} config - 当前表单项的配置
   * @param  {IAnyObject} values - dependOn配置的依赖项的值组成的对象
   * @param  {IAnyObject} outValues
   * @description 需要返回修改后的config，才能触发修改对当前表单项的配置
   * @return config
   */
  changeConfig?: TChangeConfig
  changeConfigStr?: string
  /**
   * 修改当前表单项的配置，受{@link dependOn} 配置影响，会在dependOn的值发生修改时触发
   * @param  {IAnyObject} values - dependOn配置的依赖项的值组成的对象
   * @param  {IAnyObject} outValues
   * @description 返回undefined将忽略本次对当前表单项更新值的操作，返回{value: any, otherValue: any}会对当前表单项的值进行修改
   * @return undefined | {value: any, otherValue: any}
   */
  changeValue?: TChangeValue
  changeValueStr?: string
  immediateChangeValue?: boolean
  changeValueByOld?: TChangeValueByOld
  changeEffect?: (value: unknown, key: string, model: IAnyObject) => Promise<boolean>
  insert?: TInsert
  // 表单验证相关
  requiredType?: FormItemRule['type']
  validateValue? :string
  regexpValidateErrorMessage?: string
  validateExistRemote?: (value: unknown, values: IAnyObject, outValues: IAnyObject) => Promise<{data: boolean}> | {data: boolean}
  validateExistRemoteErrorMessage?: string
  // 占位
  span?: number
  labelWidth?: string | number
  labelPosition?: 'left'|'right'| 'top'
  hideLabel?: boolean
  contentEnd?: boolean
  itemMarginBottom?: string
  // css
  labelStyle?: CSSProperties
  inputStyle?: CSSProperties
  itemStyle?: CSSProperties
  style?: CSSProperties
  $render?: Slot<IAnyObject>
  [propname: string]: unknown
}
interface ITableRenderProps {
  // eslint-disable-next-line no-use-before-define
  config: ITableRenderConfig | IRenderConfig
  fieldKey: string
  index: number
  model: IAnyObject
  key: string
  tableRuleKey: string
  propertyKey: string
  columnKey: string
  tableDependOnValues: IAnyObject
  tableData: Array<IAnyObject>
  updateData: (val: IAnyObject, index: number) => void
  $index: number
  $position: 'table'
}
// table特有
export interface ITableRenderConfig {
  columnType?: 'checkbox'
  /**
   * 超出宽度后是否展示tooltip
   */
  showOverflowTooltip?: boolean
  dynamic?: boolean // dependOn是否生效
  __render?: (props: ITableRenderProps) => VNode
  fixed?: boolean | 'left' | 'right'
  /**
   * 当前表单项最小宽度
   */
  minWidth?: string
  align?: 'left' | 'center' | 'right'
  slots?: {
    header?: Slot
  }
  selectable?: (params: {row: IAnyObject; index: number}) => boolean
}

interface IBaseFormRenderConfig{
  /**
   * 当前表单项占用的栅格数
   */
  span?: number // form search-form特供
  labelWidth?: string /// / form search-form特供
  labelStyle?: IAnyObject,
  itemStyle?: IAnyObject
}
interface IFormRenderConfig{
  /**
   * 当前表单项是否必填
   */
  required?: boolean // form 特供
  requiredErrorMessage?: string
  triggerType?: 'input' // 文字提示 请输入 ｜ 请选择
  requiredType?: 'blur'|'change'
  validateValue?: 'email' | 'identityCard' | 'mobilePhone'
  regexpValidate?: string
  validateExistRemote?: (value:unknown, dependOnValues: IAnyObject) => Promise<{data: boolean}>
  validateExistRemoteErrorMessage?: string
}
interface ISearchRenderConfig {
  immediateSearch?: boolean // 变更时立即触发搜索
  autoSelect?: boolean // options组件
}

export interface IEntityConfig {
  type?: string
  field?: string
  _renderConfig?: IRenderConfig
}
export interface IFormConfig<T = Record<string, unknown>> {
  key: keyof T
  id?: string
  config: IRenderConfig
}
export interface ITableColumnConfig {
  key: string
  config: IRenderConfig | ITableRenderConfig | {children: Array<ITableColumnConfig>}
}

export type IFieldConfig<T extends Record<string, unknown>> = Record<keyof T, IRenderConfig>
export type IFormFieldConfig<T extends Record<string, unknown>> = Record<keyof T, IRenderConfig | IBaseFormRenderConfig | IFormRenderConfig>
export type ISearchFieldConfig<T extends Record<string, unknown>> = Record<keyof T, IRenderConfig | IBaseFormRenderConfig | ISearchRenderConfig>
export type ITableFieldConfig<T extends Record<string, unknown>> = Record<keyof T, IRenderConfig | ITableRenderConfig>

// configMapToList即mergeFieldConfig联合使用
export const generateFieldList = <T extends Record<string, unknown>>(configMap: IFieldConfig<T>, ...source: Array<Record<keyof T, IEntityConfig>|IFieldConfig<T>>) => configMapToList(mergeFieldConfig(configMap, ...source)) as IFormConfig<T>[]

export const mergeFieldConfig = <T extends Record<string, unknown>>(targetConfigMap: IFieldConfig<T>, ...sourceConfigMaps: Array<Record<keyof T, IEntityConfig>|IFieldConfig<T>>) => {
  const result = {} as IFieldConfig<T>
  Object.keys(targetConfigMap).forEach(key => {
    const targetConfig = targetConfigMap[key] || {}
    result[key as keyof T] = getMergeConfig(key, targetConfig, sourceConfigMaps) as IRenderConfig
  })
  return result as IFieldConfig<T>
}

/**
 * config 对象转为数组 (table时用的较多)
 * @param configMap
 * @return {{sort: number, config: *, key: string}[]}
 */
export const configMapToList = <T extends Record<string, unknown>>(configMap: IFieldConfig<T>) => {
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
export const insertFieldConfigToList = <T extends Record<string, unknown>>(target: IFormConfig<T>[] = [], source: IFormConfig<T>[]) => {
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

export const configListToMap = <T extends Record<string, unknown>>(configList: IFormConfig<T>[]) => {
  const result = {} as IFieldConfig<T>
  configList.forEach(({ key, config } = { key: '', config: {} }) => {
    if (key) {
      result[key] = config
    }
  })
  return result
}
const handlerDependOn = (dependOn: IRenderConfig['dependOn'], newDependOn: IRenderConfig['dependOn'], isMerge: boolean) => {
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
function getMergeConfig <T extends Record<string, unknown>> (key: string, targetConfig: IRenderConfig, sourceConfigMaps: (IFieldConfig<T>|Record<keyof T, IEntityConfig>)[]) {
  let sourceConfig = {} as IRenderConfig
  const sourceKey = targetConfig.sourceKey || targetConfig.realKey || key
  let dependOn = [] as IRenderConfig['dependOn']
  const isMergeDependOn = targetConfig.mergeDependOn === true
  if (sourceKey) {
    const sourceKeys = sourceKey.split('.')
    sourceConfigMaps.forEach((sourceConfigMap = {} as IFieldConfig<T>) => {
      let sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKey])
      if (!sourceConfigNext && sourceKeys.length > 1) {
        sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKeys[0]])
        const preKey = [sourceKeys[0]]
        for (let i = 1; i < sourceKeys.length; i++) {
          if (!sourceConfigNext) break
          sourceConfigNext = getFieldConfig(sourceConfigNext[sourceKeys[i]] as IRenderConfig, preKey.join('.')) as IRenderConfig
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
  return { ...sourceConfig, ...targetConfig, dependOn } as IRenderConfig
}

/**
 * 处理深层对象的副作用函数
 * @param fn
 * @param key
 * @param preKey
 * @return {(function(...[*]): *)|*}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const handlerEffectFunction = (fn: Function, key: string, preKey: string) => {
  // 如果fn不为函数返回原值
  if (typeof fn !== 'function') return fn
  if (key === 'changeConfig') {
    return (...args: unknown[]) => {
      return fn(args[0], getFieldValue(args[1], preKey) ?? {}, getFieldValue(args[2], preKey) ?? {})
    }
  }
  // 私有effect中无getOptionsFilter、asyncOptions
  if (['changeValue', 'asyncOptions', 'getOptionsFilter'].includes(key)) {
    return (...args: unknown[]) => {
      return fn(getFieldValue(args[0], preKey) ?? {}, getFieldValue(args[1], preKey) ?? {})
    }
  }
  // 如果key不符合上述条件返回原值
  return fn
}
/**
 * 获取字段配置（_renderConfig为数据定义时定义的字段渲染配置）
 * @param config
 * @param preKey
 * @return {{}|*}
 */
function getFieldConfig (config: IRenderConfig | IEntityConfig, preKey = '') {
  if (config?._renderConfig) {
    const _renderConfig = cloneDeep(config._renderConfig) as IRenderConfig
    if (preKey) {
      const dependOn = _renderConfig.dependOn
      if (dependOn && dependOn.length > 0) {
        _renderConfig.dependOn = dependOn.map(on => {
          if (typeof on === 'object') {
            const effect = handlerEffect(on.effect as IRenderConfigDependOnEffect, preKey)
            return {
              key: `${preKey}.${on.key}`,
              effect
            }
          } else {
            return `${preKey}.${on}`
          }
        }) as IRenderConfig['dependOn'];
        // `${preKey}.${on}`
        ['changeConfig', 'changeValue', 'asyncOptions', 'getOptionsFilter'].forEach(key => {
          if (typeof _renderConfig[key] === 'function') {
            // eslint-disable-next-line @typescript-eslint/ban-types
            _renderConfig[key] = handlerEffectFunction(_renderConfig[key] as Function, key, preKey)
          }
        })
      }
      const otherKey = _renderConfig.otherKey
      if (typeof otherKey === 'string') {
        _renderConfig.otherKey = `${preKey}.${otherKey}`
      } else if (isArray(otherKey)) {
        _renderConfig.otherKey = (otherKey as string[]).map(v => `${preKey}.${v}`)
      }
    }
    return _renderConfig as IRenderConfig
  } else {
    return config as IRenderConfig
  }
}

/**
 * 处理dependOn 为对象时的副作用配置
 * @param effect
 * @param preKey
 * @return {{}}
 */
function handlerEffect (effect: IRenderConfigDependOnEffect, preKey: string) {
  const result = {} as IRenderConfigDependOnEffect
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

export const keysToConfigMap = <T extends Record<string, unknown>>(keys: Array<keyof T | (IRenderConfig & {key: keyof T})>) => {
  const configMap = {} as IFieldConfig<T>
  keys.forEach(key => {
    let config = {} as IRenderConfig
    let configKey = key as string
    if (typeof key === 'object') {
      config = { ...key } as IRenderConfig
      configKey = key.key as string
      config.key = undefined
    }
    configMap[configKey as keyof T] = config
  })
  return configMap
}

export const defineFieldConfig = <T extends Record<string, unknown>>(config: IFormFieldConfig<T>) => config
// 为ts服务
// form配置
export const defineFormFieldConfig = <T extends Record<string, unknown>>(config: IFormFieldConfig<T>) => config
// table配置
export const defineTableFieldConfig = <T extends Record<string, unknown>>(config: ITableFieldConfig<T>) => config
// search-form配置
export const defineSearchFieldConfig = <T extends Record<string, unknown>>(config: ISearchFieldConfig<T>) => config
