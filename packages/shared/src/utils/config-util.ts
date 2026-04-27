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

/** 异步加载选项（dependOn / remote 等场景下的拉取函数） */
export type TAsyncOptions = (
  dependOnValues?: IAnyObject,
  outDependOnValues?: IAnyObject,
  extra?: unknown
) => Promise<unknown[]>

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

// 基础的渲染配置 form searchForm table共有
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
   * otherKey 的默认值，当 otherValue 为空时自动设置
   * 支持：
   * - 静态数组：Array<unknown>
   * - 函数：() => Array<unknown>，运行时计算
   * 数组元素按顺序对应 otherKey 数组
   */
  otherDefaultValue?: Array<unknown> | (() => Array<unknown>)
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
  /** 是否隐藏整个表单项 */
  hideItem?: boolean
  // 占位
  placeholder?: string
  noMatchText?: string
  clearable?: boolean
  /**
   * 主字段默认值，支持：
   * - 静态值：字符串、数字、布尔值等
   * - 函数：() => any，运行时计算
   * - 模板字符串：'{{now}}' 等模板
   */
  defaultValue?: V | (() => V) | string
  /** 函数：异步拉取选项；字符串：设计器保存的函数体源码，运行时编译 */
  asyncOptions?: TAsyncOptions | string
  // css
  inputStyle?: CSSProperties
  style?: CSSProperties
}
// 经过扩展后的IRenderConfig
export type ExtendedConfig<T extends keyof ComposeType = keyof ComposeType, V = unknown> = T extends any ? IRenderConfig<T, V> & ComposeType[T] : never;
// __render的入参
export interface ITableRenderProps {
  // eslint-disable-next-line no-use-before-define
  config: Partial<ITableColumnConfig['config']>

  fieldKey: string
  index: number
  model: IAnyObject
  row?: IAnyObject
  key: string
  tableRuleKey?: string

  propertyKey: string | number
  columnKey: string
  tableDependOnValues?: IAnyObject

  tableData: Array<IAnyObject>
  updateData: (val: IAnyObject, index: number) => void
  $index: number
  $position: 'table'
}

// table特有的属性
export interface ITableRenderConfig {
  columnType?: 'checkbox' | 'mainField'
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
  span?: number
  labelWidth?: string | number
  labelStyle?: CSSProperties
  itemStyle?: CSSProperties
  labelPosition?: 'left' | 'right' | 'top'
  hideLabel?: boolean
  contentEnd?: boolean
  itemMarginBottom?: string
  /** 自定义渲染插槽，form/searchForm 场景使用 */
  __render?: Slot<IAnyObject>
  /** 是否在此字段前强制换行 */
  br?: boolean
}
export interface ICustomValidator {
  (values: unknown, dependOnValues: IAnyObject, outDependOnValues: IAnyObject): Promise<{data?: boolean ; message?: string }>
 message: string
 type: string
}
// 运行时内部注入属性，不应由用户直接配置
export interface IRuntimeConfig {
  /** 内部属性: layout 的 item 需要用到 */
  _isGrid?: number
  /** 内部属性: 控制是否显示 */
  _isShow?: boolean
  /** 内部属性: 序号，由 genNo 注入 */
  no?: string | VNode
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
  requiredType?: FormItemRule['type']
  validateValue?: 'email' | 'identityCard' | 'mobilePhone' | 'sql'
  regexpValidate?: string
  regexpValidateErrorMessage?: string
  validateExistRemote?: (value: unknown, dependOnValues: IAnyObject, outDependOnValues: IAnyObject) => Promise<{data: boolean}> | {data: boolean}
  validateExistRemoteErrorMessage?: string
  requiredRuleConfig?: any
  validateValueErrorMessage?: string
  customValidators?: Array<ICustomValidator>
  importantDisabled?: boolean
  /** 是否为目录（层级） */
  directory?: number
  /** 特殊的静态组件 */
  staticInfo?: string
  /** 表单项边框（showOnly + border 将出现边框） */
  border?: boolean
}
// searchForm特有的属性
export interface ISearchRenderConfig {
  immediateSearch?: boolean // 变更时立即触发搜索
  autoSelect?: boolean // options组件
}
export type TSearchFormConfig = ExtendedConfig & IBaseFormRenderConfig & ISearchRenderConfig & IRuntimeConfig

export type TFormConfig = ExtendedConfig & IBaseFormRenderConfig & IFormRenderConfig & IRuntimeConfig
export interface IEntityConfig {
  type?: string
  field?: string
  _renderConfig?: IRenderConfig
}

/** 通用字段项容器 */
export interface IFieldItem<C = IRenderConfig> {
  key: string
  id?: string
  config: C
  /** 是否在此字段前强制换行 */
  br?: boolean
}

/**
 * 向后兼容别名
 * @deprecated 请优先使用 IFieldItem、IFormFieldItem、ISearchFieldItem 或 ITableColumnItem
 */
export type IFormConfig<_T extends NoArrayObject<_T> = Record<string, number>> = IFieldItem

export type TTableColumns = ExtendedConfig & ITableRenderConfig & IRuntimeConfig & {
  children?: Array<{ key: string, config: TTableColumns }>
}
export interface ITableColumnConfig {
  key: string
  config: TTableColumns
}

/** 便捷别名 */
export type IFormFieldItem = IFieldItem<TFormConfig>
export type ISearchFieldItem = IFieldItem<TSearchFormConfig>
export type ITableColumnItem = IFieldItem<TTableColumns> & { config: TTableColumns & { children: Array<ITableColumnItem> } }

type TFieldConfigKind = 'field' | 'form' | 'table' | 'search'

declare const FIELD_CONFIG_KIND: unique symbol

type TMarkedFieldConfig<ConfigMap, Kind extends TFieldConfigKind> = ConfigMap & {
  readonly [FIELD_CONFIG_KIND]?: Kind
}

type TFieldMapKey<Entity> = Exclude<keyof Entity | (string & {}), typeof FIELD_CONFIG_KIND>

export type IFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<TFieldMapKey<Entity>, ExtendedConfig>>
export type IFormFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<TFieldMapKey<Entity>, TFormConfig>>
export type ISearchFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<TFieldMapKey<Entity>, TSearchFormConfig>>
export type ITableFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> = Partial<Record<TFieldMapKey<Entity>, TTableColumns>>

type TFieldConfigValue<ConfigMap> = Extract<Exclude<ConfigMap[keyof ConfigMap], undefined>, ExtendedConfig>
type TLooseSourceConfigMap = Record<string, ExtendedConfig | IEntityConfig | undefined>

/** 合并来源：普通 map、实体 map，或 define*FieldConfig 打标后的 map */
type TFieldConfigMapSource<Entity extends NoArrayObject<Entity> = Record<string, unknown>> =
  | IFieldConfig<Entity>
  | Record<keyof Entity, IEntityConfig>
  | TMarkedFieldConfig<IFormFieldConfig<Entity>, 'form'>
  | TMarkedFieldConfig<ISearchFieldConfig<Entity>, 'search'>
  | TMarkedFieldConfig<ITableFieldConfig<Entity>, 'table'>

type TFieldConfigKindOf<ConfigMap> = ConfigMap extends {
  readonly [FIELD_CONFIG_KIND]?: infer Kind
}
  ? Kind extends TFieldConfigKind ? Kind : 'field'
  : 'field'

type TFieldListItem<Config = ExtendedConfig> = IFieldItem<Config> & { sort: number }

type TGenerateFieldListResult<ConfigMap> = TFieldConfigKindOf<ConfigMap> extends 'table'
  ? Array<TFieldListItem<TTableColumns>>
  : TFieldConfigKindOf<ConfigMap> extends 'search'
    ? Array<TFieldListItem<TSearchFormConfig>>
    : TFieldConfigKindOf<ConfigMap> extends 'form'
      ? Array<TFieldListItem<TFormConfig>>
      : Array<TFieldListItem<ExtendedConfig>>

// configMapToList即mergeFieldConfig联合使用
export function generateFieldList <
  Entity extends NoArrayObject<Entity> = Record<string, unknown>,
  ConfigMap extends TFieldConfigMapSource<Entity> = TFieldConfigMapSource<Entity>
> (configMap: ConfigMap, ...source: Array<TFieldConfigMapSource<Record<string, unknown>>>): TGenerateFieldListResult<ConfigMap> {
  const mergedConfigMap = mergeFieldConfig(configMap, ...source)
  return configMapToList(mergedConfigMap)
}

export function mergeFieldConfig <
  Entity extends NoArrayObject<Entity>,
  ConfigMap extends TFieldConfigMapSource<Entity> = TFieldConfigMapSource<Entity>
> (targetConfigMap: ConfigMap, ...sourceConfigMaps: Array<TFieldConfigMapSource<Record<string, unknown>>>): ConfigMap {
  const result = {} as ConfigMap
  Object.keys(targetConfigMap).forEach(key => {
    const typedKey = key as keyof ConfigMap
    const targetConfig = (targetConfigMap[typedKey] || {}) as TFieldConfigValue<ConfigMap>
    result[typedKey] = getMergeConfig<Entity, TFieldConfigValue<ConfigMap>>(key, targetConfig, sourceConfigMaps) as ConfigMap[typeof typedKey]
  })
  return result
}

/**
 * config 对象转为数组 (table时用的较多)
 */
export function configMapToList <
  Entity extends NoArrayObject<Entity> = Record<string, unknown>,
  ConfigMap extends TFieldConfigMapSource<Entity> = TFieldConfigMapSource<Entity>
> (configMap: ConfigMap): TGenerateFieldListResult<ConfigMap> {
  return Object.keys(configMap).map((key, i) => {
    const config = configMap[key as keyof (typeof configMap)]! as ExtendedConfig
    key = config.realKey || key // realKey的优先级高于原本的key用于处理object相同的key智能有一个的问题
    return {
      key, // realKey的优先级高于key,
      config,
      sort: config.configSort || i,
      br: (config as any).br
    }
  }).sort((a, b) => a.sort - b.sort) as TGenerateFieldListResult<ConfigMap>
}

/**
 * 将一个字段配置数据插入到另一个配置数据中
 */
export function insertFieldConfigToList <C extends { insert?: TInsert } = ExtendedConfig> (target: Array<IFieldItem<C>> = [], source: Array<IFieldItem<C>>) {
  target = [...target] // 需要浅拷贝一次不然会导致值被修改的问题
  source.forEach(fieldConfig => {
    if (!fieldConfig?.config) return
    const insert = fieldConfig.config.insert
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

export function configListToMap <T extends NoArrayObject<T>, C extends ExtendedConfig = ExtendedConfig> (configList: Array<IFieldItem<C>>) {
  const result = {} as Partial<Record<keyof T | (string & {}), C>>
  configList.forEach(({ key, config }) => {
    if (key) {
      result[key as keyof T | (string & {})] = config
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
function getMergeConfig <
  Entity extends NoArrayObject<Entity>,
  Config extends ExtendedConfig = ExtendedConfig
> (key: string, targetConfig: Config, sourceConfigMaps: Array<TFieldConfigMapSource<Record<string, unknown>>>): Config {
  let sourceConfig = {} as Config
  const sourceKey = targetConfig.sourceKey || targetConfig.realKey || key
  let dependOn = [] as IRenderConfig['dependOn']
  const isMergeDependOn = targetConfig.mergeDependOn === true
  if (sourceKey) {
    const sourceKeys = sourceKey.split('.')
    sourceConfigMaps.forEach((sourceConfigMap = {} as TFieldConfigMapSource<Record<string, unknown>>) => {
      const sourceMap = sourceConfigMap as TLooseSourceConfigMap
      let sourceConfigNext = getFieldConfig<Config>(sourceMap[sourceKey])
      if (!sourceConfigNext && sourceKeys.length > 1) {
        sourceConfigNext = getFieldConfig<Config>(sourceMap[sourceKeys[0]])
        const preKey = [sourceKeys[0]]
        for (let i = 1; i < sourceKeys.length; i++) {
          if (!sourceConfigNext) break
          const nestedSourceMap = sourceConfigNext as unknown as TLooseSourceConfigMap
          sourceConfigNext = getFieldConfig<Config>(nestedSourceMap[sourceKeys[i]], preKey.join('.'))
          preKey.push(sourceKeys[i]) // 最后一个key,舍弃
        }
      }
      dependOn = handlerDependOn(sourceConfig?.dependOn as IRenderConfig['dependOn'], sourceConfigNext?.dependOn as IRenderConfig['dependOn'], isMergeDependOn)
      sourceConfig = { ...sourceConfig, ...sourceConfigNext }
    })
  }
  /**
   * 合并逻辑
   */
  if (isMergeDependOn) {
    dependOn = handlerDependOn(dependOn, targetConfig.dependOn as IRenderConfig['dependOn'], true)
  } else {
    dependOn = (targetConfig.dependOn as IRenderConfig['dependOn']) || dependOn
  }

  return { ...sourceConfig, ...targetConfig, dependOn } as Config
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

const isEntityConfig = (config: ExtendedConfig | IEntityConfig | undefined): config is IEntityConfig & { _renderConfig: IRenderConfig } => {
  return typeof config === 'object' && config !== null && '_renderConfig' in config && !!config._renderConfig
}

/**
 * 获取字段配置（_renderConfig为数据定义时定义的字段渲染配置）
 */
function getFieldConfig <Config extends ExtendedConfig = ExtendedConfig> (config: Config | IEntityConfig | undefined, preKey = ''): Config | undefined {
  if (!config) return undefined
  if (isEntityConfig(config)) {
    const _renderConfig = cloneDeep(config._renderConfig) as Config
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
        }) as Config['dependOn']

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
    return _renderConfig
  }
  return config as Config
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
export function defineFieldConfig <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: IFormFieldConfig<Entity>): TMarkedFieldConfig<IFormFieldConfig<Entity>, 'form'> { return config as TMarkedFieldConfig<IFormFieldConfig<Entity>, 'form'> }
// form配置
export function defineFormFieldConfig <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: IFormFieldConfig<Entity>): TMarkedFieldConfig<IFormFieldConfig<Entity>, 'form'> { return config as TMarkedFieldConfig<IFormFieldConfig<Entity>, 'form'> }
// table配置
export function defineTableFieldConfig <Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: ITableFieldConfig<Entity>): TMarkedFieldConfig<ITableFieldConfig<Entity>, 'table'> { return config as TMarkedFieldConfig<ITableFieldConfig<Entity>, 'table'> }
// search-form配置
export function defineSearchFieldConfig<Entity extends NoArrayObject<Entity> = Record<string, unknown>> (config: ISearchFieldConfig<Entity>): TMarkedFieldConfig<ISearchFieldConfig<Entity>, 'search'> { return config as TMarkedFieldConfig<ISearchFieldConfig<Entity>, 'search'> }
