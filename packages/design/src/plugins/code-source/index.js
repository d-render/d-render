import CodeSourceComponent from './component'
import { EditorCode } from '@/svg'
import { h } from 'vue'
export class CodeSourcePlugin {
  constructor (options) {
    this.type = 'modules'
    this.Component = CodeSourceComponent
    this.config = { name: 'code', title: '源码', icon: h(EditorCode) }
    this.options = options
  }
}
