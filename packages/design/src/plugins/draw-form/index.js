import DrawFormComponent from './component'
export class DrawFormPlugin {
  constructor (options) {
    this.type = 'draw'
    this.config = { name: 'from', title: '表单' }
    this.Component = DrawFormComponent
    this.options = options
  }
}
