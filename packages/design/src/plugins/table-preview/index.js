import { CipFormRender } from 'd-render'
import { PreviewPlugin } from '../plugin'
export class FormPreviewPlugin extends PreviewPlugin {
  constructor (options) {
    super(options)
    this.Component = CipFormRender
  }
}
