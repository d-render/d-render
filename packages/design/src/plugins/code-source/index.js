import CodeSourceComponent from './component'
import { EditorCode } from '@/svg'
import { h } from 'vue'
import { ModulePlugin } from '../plugin'
export class CodeSourcePlugin extends ModulePlugin {
  constructor (options) {
    super(options)
    this.Component = CodeSourceComponent
    this.config = { name: 'code', title: '源码', icon: h(EditorCode) }
  }
}
