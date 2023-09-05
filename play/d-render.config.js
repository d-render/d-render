import PluginCCI from '@cip/d-render-plugin-cci'
import '@cip/d-render-plugin-cci/dist/index.css'
import PluginCCIMobile from '@cip/d-render-plugin-cci-mobile'
import '@cip/d-render-plugin-cci-mobile/dist/index.css'
import 'vant/lib/index.css'
import customInputsPlugin from '@/components/custom-form-input/component-config'
import customLayoutPlugin from '@/components/custom-form-layout/component-config'
import PluginStandard from '@d-render/plugin-standard'
import PluginStandardConfigure from '@d-render/plugin-standard-configure'
import { insertConfig } from '@d-render/shared'
const completePluginStandard = insertConfig(PluginStandard, PluginStandardConfigure, 'configure')
export default {
  plugins: [
    insertConfig(insertConfig(PluginCCI, { text: PluginStandardConfigure.text }, 'configure'), PluginCCIMobile, 'mobile'),
    {
      input: insertConfig(completePluginStandard, { input: PluginCCIMobile.input }, 'mobile').input
    },
    customInputsPlugin,
    customLayoutPlugin
  ]
}
