import PluginCCI from '@cip/d-render-plugin-cci'
import customInputsPlugin from '@/components/custom-form-input/component-config'
import customLayoutPlugin from '@/components/custom-form-layout/component-config'
import PluginStandard from '@d-render/plugin-standard'
import PluginStandardConfigure from '@d-render/plugin-standard-configure'
import { insertConfig } from '@d-render/shared'
const completePluginStandard = insertConfig(PluginStandard, PluginStandardConfigure, 'configure')
export default {
  plugins: [
    PluginCCI,
    {
      input: completePluginStandard.input
    },
    {
      select: PluginCCI.select,
      default: PluginCCI.default
    },
    customInputsPlugin,
    customLayoutPlugin
  ]
}
