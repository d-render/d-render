import { defineAsyncComponent } from 'vue'
// import { require } from "app-root-path";
// #TODO：为了解决dynamic import 问题，d-render 组件不再提供默认组件支持，需要从项目中自行引入
// #! Broken change!!!
// import defaultInputComponentConfig from '../cip-form-input/component-config'
// import defaultLayoutComponentConfig from '../cip-form-layout/component-config'
const defaultInputComponentConfig = {}; const defaultLayoutComponentConfig = {}
const generateAppendKey = (append) => {
  return append ? `-${append}` : ''
}
const analyseComponents = (dictionary, append) => {
  const result = {}
  const appendKey = generateAppendKey(append) // append ? `-${append}` : ''
  const appendPath = append ? `/${append}` : ''
  // const errorComponent = defineAsyncComponent(dictionary.default(appendPath))
  Object.keys(dictionary).map(key => {
    const loader = dictionary[key](appendPath) || dictionary.default(appendPath)
    result[`${key}${appendKey}`] = defineAsyncComponent({
      loader,
      errorComponent: defineAsyncComponent(dictionary.default(appendPath)),
      onError (error, retry, fail, attempts) {
        console.log(error)
        console.warn(`${key}${appendKey}组件加载失败，加载默认组件`)
        fail()
      }
    })
  })
  return result
}

const getComponentDictionary = (componentConfig) => {
  const result = {}
  Object.keys(componentConfig).forEach(key => {
    const config = componentConfig[key]
    const component = typeof config === 'function' ? config : componentConfig[key].component
    result[key] = component
  })
  return result
}
const getLayoutType = (componentConfig) => {
  const result = []
  Object.keys(componentConfig).forEach(key => {
    if (componentConfig[key].layout) {
      result.push(key)
    }
  })
  return result
}
const getPageType = (componentConfig) => {
  const result = []
  Object.keys(componentConfig).forEach(key => {
    if (componentConfig[key].page) {
      result.push(key)
    }
  })
  return result
}

/**
 * 贯穿整个数据渲染的单例对象
 */
export class DRender {
  constructor () {
    if (!DRender.instance) {
      this.init()
      DRender.instance = this
    }
    return DRender.instance
  }

  defaultComponentConfig = {}
  componentDictionary = {}
  layoutTypeList = []
  // 初始化
  init () {
    const defaultComponentConfig = { ...defaultInputComponentConfig, ...defaultLayoutComponentConfig }
    this.defaultComponentConfig = defaultComponentConfig
    this.componentDictionary = getComponentDictionary(defaultComponentConfig)
    this.layoutTypeList = getLayoutType(defaultComponentConfig)
  }

  setConfig (renderConfig = {}) {
    const { components, plugins } = renderConfig
    const customComponentConfig = {}
    if (components) Object.assign(customComponentConfig, components)
    if (plugins) Object.assign(customComponentConfig, ...plugins)
    this.setCustomComponents(customComponentConfig)
  }

  setCustomComponents (customComponentsConfig) {
    const componentConfig = { ...this.defaultComponentConfig, ...customComponentsConfig }
    const componentDictionary = getComponentDictionary(componentConfig)
    this.componentDictionary = componentDictionary
    this.layoutTypeList = getLayoutType(componentConfig)
    this.pageTypeList = getPageType(componentConfig)
  }

  // 获取组件
  getComponent (type, append = '') {
    if (!this[`${append}Components`]) {
      // 如果是没有缓存过的组件组 分析一次
      this[`${append}Components`] = analyseComponents(this.componentDictionary, append)
    }
    const components = this[`${append}Components`][`${type}${generateAppendKey(append)}`]
    if (components) return components
    // 若没有找到则加载default, 注必须要有default渲染模式
    return this[`${append}Components`][`default${generateAppendKey(append)}`]
  }

  isLayoutType (type) {
    return this.layoutTypeList.includes(type)
  }

  isPageType (type) {
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

export const defineDRenderConfig = val => val

export const insertConfig = (plugin, componentPlugin, mode) => {
  return Object.keys(componentPlugin).reduce((acc, key) => {
    const originConfig = plugin[key]
    let newConfig = {}
    if (originConfig) {
      // 生成新的组件配置
      if (typeof originConfig === 'function') {
        newConfig = (mode) => {
          if (mode === `/${mode}`) {
            return componentPlugin[key]
          } else {
            return originConfig(mode)
          }
        }
      } else {
        const { component, ...otherConfig } = originConfig
        newConfig = { ...otherConfig }
        newConfig.component = (mode) => {
          if (mode === `/${mode}`) {
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
