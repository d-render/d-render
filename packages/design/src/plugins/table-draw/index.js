import DrawFormComponent from './component'
import { DrawPlugin } from '../plugin'
export class TableDrawPlugin extends DrawPlugin {
  constructor (options) {
    super(options)
    this.config = { name: 'table', title: '表格' }
    this.Component = DrawFormComponent
  }
}
