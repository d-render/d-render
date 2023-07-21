import PluginCCI from '@cip/d-render-plugin-cci'
import '@d-render/plugin-antdv/dist/index.css'
import customInputsPlugin from '@/components/custom-form-input/component-config'
import customLayoutPlugin from '@/components/custom-form-layout/component-config'
export default {
  plugins: [
    // PluginStandard,
    PluginCCI,
    {
      default: PluginCCI.default
    },
    customInputsPlugin,
    customLayoutPlugin
  ]
}

console.log(PluginCCI.default)
