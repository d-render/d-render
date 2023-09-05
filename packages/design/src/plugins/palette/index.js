import Component from './component-group/index'
import { EditorRenderer } from '@/svg'
import { h } from 'vue'
import { ModulePlugin } from '../plugin'
export class PalettePlugin extends ModulePlugin {
  constructor (options) {
    super(options)
    this.Component = Component
    this.config = { name: 'palette', title: '组件', icon: h(EditorRenderer) }// { name: 'structure', title: '结构', icon: h(EditorOutline) }
  }
}
