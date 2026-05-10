import { DRender } from 'd-render'
import PluginStandard from '@d-render/plugin-standard'
import 'd-render/style'

let inited = false

/** 文档站仅在浏览器动态加载示例后调用，用于注册标准插件与样式 */
export function ensureDocDRender () {
  if (inited) return
  inited = true
  const dRender = new DRender()
  dRender.setConfig({ plugins: [PluginStandard] })
  console.log(dRender.componentDictionary.input('/index'))
}
