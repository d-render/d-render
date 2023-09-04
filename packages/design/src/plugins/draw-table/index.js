import DrawFormComponent from './component'
export class DrawTablePlugin {
  constructor (options) {
    this.type = 'draw'
    this.config = { name: 'table', title: '表格' }
    this.Component = DrawFormComponent
    this.options = options
  }
}
