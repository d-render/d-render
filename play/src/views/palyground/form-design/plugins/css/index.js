import CssConfigure from './configure'

export class CssConfigurePlugin {
  constructor (options) {
    this.type = 'configure'
    this.Component = CssConfigure
    this.config = { name: 'css', title: '外观' }
    this.options = options
  }
}
