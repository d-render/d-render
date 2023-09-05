import TableRender from './component'
import { PreviewPlugin } from '../plugin'
export class TablePreviewPlugin extends PreviewPlugin {
  constructor (options) {
    super(options)
    this.Component = TableRender
  }
}
