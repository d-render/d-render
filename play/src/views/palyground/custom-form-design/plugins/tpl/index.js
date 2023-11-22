import TplNav from './nav'
import { moduleConfig as tplModuleConfig } from './module-config'
import { ModulePlugin } from '@d-render/design'
export class TplNavPlugin extends ModulePlugin {
  constructor (options) {
    super(options)
    this.Component = TplNav
    this.config = tplModuleConfig
  }
}
