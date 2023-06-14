// import PluginStandard from '@d-render/plugin-standard'/**/
import PluginAntDV from '@d-render/plugin-antdv'
import PluginCCI from '@cip/d-render-plugin-cci'
import '@d-render/plugin-antdv/dist/index.css'
import customInputsPlugin from '@/components/custom-form-input/component-config'
import customLayoutPlugin from '@/components/custom-form-layout/component-config'
export default {
  plugins: [
    // PluginStandard,
    Object.keys(PluginCCI).reduce((acc, key) => {
      acc[`${key}`] = PluginCCI[key]
      return acc
    }, {}),
    Object.keys(PluginAntDV).reduce((acc, key) => {
      acc[`a-${key}`] = PluginAntDV[key]
      return acc
    }, {}),
    {
      default: PluginCCI.default
    },
    customInputsPlugin,
    customLayoutPlugin
  ]
}
