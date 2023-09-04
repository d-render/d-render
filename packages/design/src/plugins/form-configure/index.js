import FieldConfigure from './component'

export class FormConfigurePlugin {
  constructor (options) {
    this.type = 'configure'
    this.Component = FieldConfigure
    this.config = { name: 'form', title: '表单配置' }
    this.options = options
  }
}
