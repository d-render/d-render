import { pluginStandardMenu } from './standard'
import { pluginCCIMenu } from './cci'
export default {
  name: '_plugins',
  title: '插件',
  children: [
    pluginStandardMenu,
    pluginCCIMenu
  ]
}
