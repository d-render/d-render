import FieldConfigure from './component'
import { ConfigurePlugin } from '../plugin'
export class FieldConfigurePlugin extends ConfigurePlugin {
  constructor (options) {
    super(options)
    this.Component = FieldConfigure
    this.config = { name: 'field', title: '字段配置' }
  }
}
