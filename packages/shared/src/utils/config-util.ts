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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NoArrayObject<T> = object

// 1. 定义基础类型映射
export interface TypeExtensions {
  // 内置默认类型
  default: { }
  // 其他基础类型...
  date: { viewType?: 'datetime' }
  number: {}
  dateRange: { otherKey?: string }
}

// 3. 暴露扩展点声明
export interface DRenderTypeExtensions{
  any: {}
}

export type ComposeType = TypeExtensions & DRenderTypeExtensions;
// ExtendedConfig
// eslint-disable-next-line no-use-before-define
export type TChangeConfig<T extends keyof ComposeType = keyof ComposeType> = (config: ExtendedConfig<T>, values: IAnyObject, outValues: IAnyObject) => ExtendedConfig<T>;

export type TChangeValue = (values: any, outValues: any) => { value: any, otherValue?: IAnyObject } | void
export type TChangeValueByOld = (
  { key, oldValue }:{key:string, oldValue: unknown},
  values: IAnyObject, outValues: IAnyObject
) => { value: unknown, otherValue: unknown } | void

export type TInsert = {before: string, after?: string} | { before?: string, after: string }

export interface IRenderConfigDependOnEffect<T extends keyof ComposeType = keyof ComposeType> {
  changeValue?: boolean | TChangeValue
  changeConfig?: boolean | TChangeConfig<T>
}
export interface IRenderConfigDependOn<T extends keyof ComposeType = keyof ComposeType> {
  key: string
  effect?: IRenderConfigDependOnEffect<T> & { resetValue?: boolean} | boolean
}

// 基础的渲染配置 form searchFrom table共有
export interface IRenderConfig <T extends keyof ComposeType = keyof ComposeType, V = unknown> {
  ruleKey?: string,
  sourceKey?: string,
  realKey?: string,
  mergeDependOn?: boolean
  /**
   * 组件类型
   */
  type?: T
  /**
   * 表单项label文案展示
   */
  label?: string
  /**
   * 辅助说明
   */
  description?: string
  /**
   *
   */
  descriptionEffect?: 'light' | 'dark' | (string & { })
  /**
   * 表单项宽度
   */
  width?: number | string
  /**
   * 当前表单项的依赖项（依赖项为当前表单的其他表单key），配置后，可在依赖项发生改变时，修改当前表单项的值或配置。
   * 修改配置 - {@link changeConfig}；
   * 修改值 - {@link changeValue}；
   */
  dependOn?: Array<string|IRenderConfigDependOn<T>>
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
  changeConfig?: TChangeConfig<T>
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
  resetValue?: boolean
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
  placeholder?: string
  noMatchText?: string
  clearable?: boolean
  defaultValue?: V
  asyncOptions?: (dependOnValue: any, outDependOnValues: any) => Promise<any[]>
  __render?: Slot<IAnyObject>
  _isShow?: boolean
}
// 经过扩展后的IRenderConfig
export type ExtendedConfig<T extends keyof ComposeType = keyof ComposeType, V = unknown> = T extends any ? IRenderConfig<T, V> & ComposeType[T] : never;
// __render的入参
export interface ITableRenderProps {
  // eslint-disable-next-line no-use-before-define
  config: ITableRenderConfig & IRenderConfig
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
// table特有的属性
export interface ITableRenderConfig {
  columnType?: 'checkbox' | 'mainField'
  hideItem?: boolean
  /**
   * 超出宽度后是否展示tooltip
   */
  showOverflowTooltip?: boolean
  dynamic?: boolean // dependOn是否生效
  formatter?: () => string
  required?: boolean
  trueLabel?: string // columnType为checkbox时生效
  falseLabel?: string // columnType为checkbox时生效
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
// form及searchForm共有的属性
export interface IBaseFormRenderConfig{
  /**
   * 当前表单项占用的栅格数
   */
  span?: number // form search-form特供
  labelWidth?: string /// / form search-form特供
  labelStyle?: IAnyObject,
  itemStyle?: IAnyObject
}
export interface ICustomValidator {
  (values: unknown, dependOnValues: IAnyObject, outDependOnValues: IAnyObject): Promise<{data?: boolean ; message?: string }>
 message: string
 type: string
}
// form特有的属性
export interface IFormRenderConfig<TType extends keyof ComposeType = keyof ComposeType>{
  /**
   * 当前表单项是否必填
   */
  required?: boolean // form 特供
  customRequiredRule?: (config: IRenderConfig<TType>, otherValue: IAnyObject, dependOnValues: IAnyObject, outDependOnValues: IAnyObject) => FormItemRule
  requiredErrorMessage?: string
  triggerType?: 'input' // 文字提示 请输入 ｜ 请选择
  requiredType?: 'blur'|'change'
  validateValue?: 'email' | 'identityCard' | 'mobilePhone'
  regexpValidate?: string
  validateExistRemote?: (value:unknown, dependOnValues: IAnyObject) => Promise<{data: boolean}>
  validateExistRemoteErrorMessage?: string
  requiredRuleConfig?: any
  validateValueErrorMessage?: string
  customValidators?: Array<ICustomValidator>
  no?: string
  directory?: boolean
  importantDisabled?: boolean
}
// searchForm特有的属性
export interface ISearchRenderConfig {
  immediateSearch?: boolean // 变更时立即触发搜索
  autoSelect?: boolean // options组件
}
export type TSearchFormConfig = ExtendedConfig & IBaseFormRenderConfig & ISearchRenderConfig

export type TFormConfig = ExtendedConfig & IBaseFormRenderConfig & IFormRenderConfig
export interface IEntityConfig {
  type?: string
  field?: string
  _renderConfig?: IRenderConfig
}

export interface IFormConfig<T extends NoArrayObject<T> = Record<string, number>> {
  key: keyof T
  id?: string
  config: IRenderConfig
  /**
   * 是否在此字段前强制换行
   * - grid模式：该字段会从新行开头开始排列
   * - inline模式：该字段会换行到新行开头，但如果当前行已满，可能会产生空行
   * - 注意：如果该字段本身就会换行（当前行已满），则无需配置 br
   */
  br?: boolean
}
export type TTableColumns = ExtendedConfig & ITableRenderConfig
export interface ITableColumnConfig {
  key: string
  config: TTableColumns & { children: Array<ITableColumnConfig> }
}
export type IFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<keyof Entity | (string & {}), ExtendedConfig>>
export type IFormFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<keyof Entity | (string & {}), TFormConfig>>
export type ISearchFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<keyof Entity | (string & {}), TSearchFormConfig>>
export type ITableFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<keyof Entity | (string & {}), TTableColumns>>

// configMapToList即mergeFieldConfig联合使用
export function generateFieldList <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (configMap: IFieldConfig<Entity>, ...source: Array<Record<keyof Entity, IEntityConfig>|IFieldConfig<Entity>>): IFormConfig<Entity>[] {
  return configMapToList(mergeFieldConfig(configMap, ...source))
}

export function mergeFieldConfig <T extends NoArrayObject<T>> (targetConfigMap: IFieldConfig<T>, ...sourceConfigMaps: Array<Record<keyof T, IEntityConfig>|IFieldConfig<T>>):IFieldConfig<T> {
  const result = {} as IFieldConfig<T>
  Object.keys(targetConfigMap).forEach(key => {
    const targetConfig = targetConfigMap[key as keyof T] || {}
    // @ts-ignore
    result[key as keyof T] = getMergeConfig(key, targetConfig, sourceConfigMaps) as IRenderConfig
  })
  return result as IFieldConfig<T>
}
/**
 * config 对象转为数组 (table时用的较多)
 */
export function configMapToList <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (configMap: IFieldConfig<Entity>) {
  return Object.keys(configMap).map((key, i) => {
    const config = configMap[key as keyof (typeof configMap)]!
    key = config.realKey || key // realKey的优先级高于原本的key用于处理object相同的key智能有一个的问题
    return {
      key, // realKey的优先级高于key,
      config,
      sort: config.configSort || i
    } as IFormConfig<Entity> & { sort: number }
  }).sort((a, b) => a.sort - b.sort)
}
/**
 * 将一个字段配置数据插入到另一个配置数据中
 */
export function insertFieldConfigToList <Entity extends NoArrayObject<Entity>> (target: IFormConfig<Entity>[] = [], source: IFormConfig<Entity>[]) {
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

export function configListToMap <T extends NoArrayObject<T>> (configList: IFormConfig<T>[]) {
  const result = {} as IFieldConfig<T>
  // @ts-ignore
  configList.forEach(({ key, config } = { key: '', config: {} }) => {
    if (key) {
      // @ts-ignore
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
 */
function getMergeConfig <T extends NoArrayObject<T>> (key: string, targetConfig: IRenderConfig, sourceConfigMaps: (IFieldConfig<T>|Record<keyof T, IEntityConfig>)[]) {
  let sourceConfig = {} as IRenderConfig
  const sourceKey = targetConfig.sourceKey || targetConfig.realKey || key
  let dependOn = [] as IRenderConfig['dependOn']
  const isMergeDependOn = targetConfig.mergeDependOn === true
  if (sourceKey) {
    const sourceKeys = sourceKey.split('.')
    sourceConfigMaps.forEach((sourceConfigMap = {} as IFieldConfig<T>) => {
      // @ts-ignore
      let sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKey])
      if (!sourceConfigNext && sourceKeys.length > 1) {
        // @ts-ignore
        sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKeys[0]])
        const preKey = [sourceKeys[0]]
        for (let i = 1; i < sourceKeys.length; i++) {
          if (!sourceConfigNext) break
          // @ts-ignore
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
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const handlerEffectFunction = (fn: InstanceType<typeof Function>, key: string, preKey: string): InstanceType<typeof Function> => {
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
 */
function getFieldConfig (config: IRenderConfig | IEntityConfig, preKey = '') {
  if ((config as IEntityConfig)?._renderConfig) {
    const _renderConfig = cloneDeep((config as IEntityConfig)._renderConfig) as IRenderConfig
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
          if (typeof _renderConfig[key as keyof IRenderConfig] === 'function') {
            // eslint-disable-next-line @typescript-eslint/ban-types
            // @ts-ignore
            _renderConfig[key as keyof IRenderConfig] = handlerEffectFunction(_renderConfig[key as keyof IRenderConfig] as (...args: unknown[]) => unknown, key, preKey)
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
 */
function handlerEffect (effect: IRenderConfigDependOnEffect, preKey: string) {
  const result = {} as IRenderConfigDependOnEffect
  Object.keys(effect).forEach(key => {
    const _key = key as keyof IRenderConfigDependOnEffect
    const item = effect[_key]
    if (typeof item !== 'function') {
      result[_key] = item
    } else {
      // @ts-ignore
      result[_key] = handlerEffectFunction(item as TChangeConfig | TChangeValue, key, preKey)
    }
  })
  return result
}

export function keysToConfigMap <T extends NoArrayObject<T> = Record<string, unknown>> (keys: Array<keyof T | (IRenderConfig & {key: keyof T})>) {
  const configMap = {} as IFieldConfig<T>
  keys.forEach(key => {
    let config = {} as IRenderConfig
    let configKey = key as string
    if (typeof key === 'object') {
      config = { ...key } as IRenderConfig
      configKey = key.key as string
      // @ts-ignore
      config.key = undefined
    }
    // @ts-ignore
    configMap[configKey as keyof T] = config
  })
  return configMap
}
export function defineFieldConfig <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: IFormFieldConfig<Entity>): IFormFieldConfig<Entity> { return config }
// form配置
export function defineFormFieldConfig <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: IFormFieldConfig<Entity>): IFormFieldConfig<Entity> { return config }
// table配置
export function defineTableFieldConfig <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: ITableFieldConfig<Entity>): ITableFieldConfig<Entity> { return config }
// search-form配置
export function defineSearchFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: ISearchFieldConfig<Entity>): ISearchFieldConfig<Entity> { return config }
