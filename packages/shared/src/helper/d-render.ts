import { AsyncComponentLoader, defineAsyncComponent } from 'vue'
// import { require } from "app-root-path";
// #TODO：为了解决dynamic import 问题，d-render 组件不再提供默认组件支持，需要从项目中自行引入
// #! Broken change!!!
// import defaultInputComponentConfig from '../cip-form-input/component-config'
// import defaultLayoutComponentConfig from '../cip-form-layout/component-config'

type TComponentConfigSimple = (mode: string) => AsyncComponentLoader
interface IComponentConfig {
  component: TComponentConfigSimple
  layout?: boolean
  page?: boolean
}
type TComponentConfig = IComponentConfig | TComponentConfigSimple
type TComponentsConfig = Record<string, TComponentConfig>
type TDRenderComponentConfig = Record<string, TComponentConfigSimple>
interface IDRenderConfig {
  components: TComponentsConfig
  plugins: TComponentsConfig[]
}

const defaultInputComponentConfig = {}; const defaultLayoutComponentConfig = {}
const generateAppendKey = (append: string) => {
  return append ? `-${append}` : ''
}
const analyseComponents = (dictionary: TDRenderComponentConfig, append: string) => {
  const result = {} as Record<string, typeof defineAsyncComponent>
  const appendKey = generateAppendKey(append) // append ? `-${append}` : ''
  const appendPath = append ? `/${append}` : ''
  // const errorComponent = defineAsyncComponent(dictionary.default(appendPath))
  Object.keys(dictionary).forEach(key => {
    const loader = dictionary[key](appendPath) || dictionary.default(appendPath)
    result[`${key}${appendKey}`] = defineAsyncComponent({
      loader,
      errorComponent: defineAsyncComponent(dictionary.default(appendPath)),
      onError (error, retry, fail) {
        console.log(error)
        console.warn(`${key}${appendKey}组件加载失败，加载默认组件`)
        fail()
      }
    })
  })
  return result
}

const getComponentDictionary = (componentConfig: TComponentsConfig) => {
  const result = {} as Record<string, ()=>AsyncComponentLoader>
  Object.keys(componentConfig).forEach(key => {
    const config = componentConfig[key]
    const component = typeof config === 'function' ? config : (config as IComponentConfig).component
    result[key] = component as () => AsyncComponentLoader
  })
  return result
}
const getLayoutType = (componentConfig: TComponentsConfig) => {
  const result = [] as string[]
  Object.keys(componentConfig).forEach(key => {
    const config = componentConfig[key]
    if (typeof config === 'object' && (config as IComponentConfig).layout) {
      result.push(key)
    }
  })
  return result
}
const getPageType = (componentConfig: TComponentsConfig) => {
  const result = [] as string[]
  Object.keys(componentConfig).forEach(key => {
    const config = componentConfig[key]
    if (typeof config === 'object' && (config as IComponentConfig).page) {
      result.push(key)
    }
  })
  return result
}

/**
 * 贯穿整个数据渲染的单例对象
 */
export class DRender {
  // eslint-disable-next-line no-use-before-define
  static instance: DRender|null = null
  constructor () {
    // @ts-ignore
    if (!DRender.instance) {
      this.init()
      // @ts-ignore
      DRender.instance = this
    }
    // @ts-ignore
    return DRender.instance
  }

  defaultComponentConfig = {}
  componentDictionary = {}
  layoutTypeList: string[] = []
  pageTypeList: string[] = []
  // 初始化
  init () {
    const defaultComponentConfig = { ...defaultInputComponentConfig, ...defaultLayoutComponentConfig }
    this.defaultComponentConfig = defaultComponentConfig
    this.componentDictionary = getComponentDictionary(defaultComponentConfig)
    this.layoutTypeList = getLayoutType(defaultComponentConfig)
  }

  setConfig (renderConfig: IDRenderConfig = {} as IDRenderConfig) {
    const { components, plugins } = renderConfig
    const customComponentConfig = {}
    if (components) Object.assign(customComponentConfig, components)
    if (plugins) Object.assign(customComponentConfig, ...plugins)
    this.setCustomComponents(customComponentConfig)
  }

  setCustomComponents (customComponentsConfig: TComponentsConfig) {
    const componentConfig = { ...this.defaultComponentConfig, ...customComponentsConfig }
    const componentDictionary = getComponentDictionary(componentConfig)
    this.componentDictionary = componentDictionary
    this.layoutTypeList = getLayoutType(componentConfig)
    this.pageTypeList = getPageType(componentConfig)
  }

  // 获取组件
  getComponent (type: string, append = '') {
    // @ts-ignore
    if (!this[`${append}Components`]) {
      // 如果是没有缓存过的组件组 分析一次
      // @ts-ignore
      this[`${append}Components`] = analyseComponents(this.componentDictionary, append)
    }
    // @ts-ignore
    const components = this[`${append}Components`][`${type}${generateAppendKey(append)}`]
    if (components) return components
    // 若没有找到则加载default, 注必须要有default渲染模式
    // @ts-ignore
    return this[`${append}Components`][`default${generateAppendKey(append)}`]
  }

  isLayoutType (type: string) {
    return this.layoutTypeList.includes(type)
  }

  isPageType (type: string) {
    return this.pageTypeList.includes(type)
  }
}
// ### Broken Change
// ### d-render.config.js 需要从外部自行注册
// // 必须直接实例化以防止数据为初始化导致的错误
// const dRender = new DRender()
// // 根据d-renderConfig
// let dRenderConfig
// try {
//   dRenderConfig = require('./d-render.config.js')
//   console.log(dRenderConfig);
//   dRender.setConfig(dRenderConfig)
// } catch (e) {
//   process.env.NODE_ENV === 'development' && console.log(e)
// }

export const defineDRenderConfig = (val: IDRenderConfig) => val

type TComponentsPlugin = Record<string, AsyncComponentLoader>

export const insertConfig = (plugin: TComponentsConfig, componentPlugin: TComponentsPlugin, componentMode: string) => {
  return Object.keys(componentPlugin).reduce((acc, key) => {
    const originConfig = plugin[key]
    let newConfig = {} as TComponentConfig
    if (originConfig) {
      // 生成新的组件配置
      if (typeof originConfig === 'function') {
        newConfig = (mode: string) => {
          if (mode === `/${componentMode}`) {
            return componentPlugin[key]
          } else {
            return originConfig(mode)
          }
        }
      } else {
        const { component, ...otherConfig } = originConfig
        newConfig = { ...otherConfig } as TComponentConfig;
        (newConfig as IComponentConfig).component = (mode: string) => {
          if (mode === `/${componentMode}`) {
            return componentPlugin[key]
          } else {
            return component(mode)
          }
        }
      }
      acc[key] = newConfig
    }
    return acc
  }, plugin)
}
