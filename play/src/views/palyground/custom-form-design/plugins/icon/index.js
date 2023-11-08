import IconComponent from './component'
import { IconHandlePlugin } from '@d-render/design'
export class IconPlugin extends IconHandlePlugin {
  constructor (options) {
    super(options)
    this.callback = options?.callback
    this.Component = IconComponent
  }
}
