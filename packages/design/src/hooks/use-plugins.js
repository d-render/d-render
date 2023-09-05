import { PLUGIN_ENUM } from '@/plugins/plugin'
import { h } from 'vue'
export const usePlugins = (plugins) => {
  const modules = []
  const configure = []
  let draw = { Component: {} }
  let preview = { Component: h('div') }
  plugins.forEach(plugin => {
    const { type } = plugin
    switch (type) {
      case PLUGIN_ENUM.PREVIEW:
        preview = plugin
        break
      case PLUGIN_ENUM.DRAW:
        draw = plugin
        break
      case PLUGIN_ENUM.CONFIGURE:
        configure.push(plugin)
        break
      case PLUGIN_ENUM.MODULE:
        modules.push(plugin)
        break
    }
  })
  return {
    modules,
    configure,
    draw,
    preview
  }
}
