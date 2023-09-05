import FieldConfigure from './component'
import { ConfigurePlugin } from '../plugin'
export class FormConfigurePlugin extends ConfigurePlugin {
  constructor (options) {
    super(options)
    this.Component = FieldConfigure
    this.config = { name: 'form', title: '表单配置' }
  }
}
