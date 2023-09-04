import FieldConfigure from './component'

export class FieldConfigurePlugin {
  constructor (options) {
    this.type = 'configure'
    this.Component = FieldConfigure
    this.config = { name: 'field', title: '字段配置' }
    this.options = options
  }
}
