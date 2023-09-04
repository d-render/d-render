import Component from './component'
import { EditorOutline } from '@/svg'
import { h } from 'vue'
export class Structure {
  constructor (options) {
    this.type = 'modules'
    this.Component = Component
    this.config = { name: 'structure', title: '结构', icon: h(EditorOutline) }
    this.options = options
  }
}
