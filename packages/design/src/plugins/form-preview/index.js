import Component from './component'
import { PreviewPlugin } from '../plugin'
export class FormPreviewPlugin extends PreviewPlugin {
  constructor (options) {
    super(options)
    this.Component = Component
  }
}
