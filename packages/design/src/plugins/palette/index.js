import Component from './component-group/index'
import { EditorRenderer } from '@/svg'
import { h } from 'vue'
export class PalettePlugin {
  constructor (options) {
    this.type = 'modules'
    this.Component = Component
    this.config = { name: 'palette', title: '组件', icon: h(EditorRenderer) }// { name: 'structure', title: '结构', icon: h(EditorOutline) }
    this.options = options
  }
}
