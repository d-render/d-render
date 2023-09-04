import DrawPageComponent from './component'
export class DrawPagePlugin {
  constructor (options) {
    this.type = 'draw'
    this.config = { name: 'page', title: '页面' }
    this.Component = DrawPageComponent
    this.options = options
  }
}
