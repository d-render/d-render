import DrawPageComponent from './component'
import { DrawPlugin } from '../plugin'
export class DrawPagePlugin extends DrawPlugin {
  constructor (options) {
    super(options)
    this.config = { name: 'page', title: '页面' }
    this.Component = DrawPageComponent
  }
}
