import PluginStandard from '@d-render/plugin-standard'
import PluginAntDV from '@d-render/plugin-antdv'
import PluginCCI from '@cip/d-render-plugin-cci'
import '@d-render/plugin-antdv/dist/index.css'
export default {
  plugins: [
    PluginStandard,
    Object.keys(PluginCCI).reduce((acc, key) => {
      acc[`c-${key}`] = PluginCCI[key]
      return acc
    }, {}),
    Object.keys(PluginAntDV).reduce((acc, key) => {
      acc[`a-${key}`] = PluginAntDV[key]
      return acc
    }, {}),
    {
      default: PluginCCI.default
    }
  ]
}
