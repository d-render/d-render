import TplNav from './nav'
import { moduleConfig as tplModuleConfig } from './module-config'

export class TplNavPlugin {
  constructor (options) {
    this.type = 'modules'
    this.Component = TplNav
    this.config = tplModuleConfig
    this.options = options
  }
}
