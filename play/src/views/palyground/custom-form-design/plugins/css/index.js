import CssConfigure from './configure'
import { ConfigurePlugin } from '@d-render/design'
export class CssConfigurePlugin extends ConfigurePlugin {
  constructor (options) {
    super(options)
    this.Component = CssConfigure
    this.config = { name: 'css', title: '外观' }
  }
}
