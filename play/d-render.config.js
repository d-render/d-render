import PluginStandard from '@d-render/plugin-standard'
import PluginAntDV from '@d-render/plugin-antdv'
import '@d-render/plugin-antdv/dist/index.css'
export default {
  plugins: [
    PluginStandard,
    Object.keys(PluginAntDV).reduce((acc, key) => {
      acc[`a-${key}`] = PluginAntDV[key]
      return acc
    }, {})
  ]
}
