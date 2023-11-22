import DrawFormComponent from './component'
import { DrawPlugin } from '../plugin'
export class FormDrawPlugin extends DrawPlugin {
  constructor (options) {
    super(options)
    this.config = { name: 'from', title: '表单' }
    this.Component = DrawFormComponent
  }
}
