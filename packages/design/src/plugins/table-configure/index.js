import FieldConfigure from './component'
import { ConfigurePlugin } from '../plugin'
export class TableConfigurePlugin extends ConfigurePlugin {
  constructor (options) {
    super(options)
    this.Component = FieldConfigure
    this.config = { name: 'table', title: '表格配置' }
  }
}
