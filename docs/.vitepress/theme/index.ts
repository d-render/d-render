import { h, defineComponent, shallowRef, onMounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.css'
import { DRender } from 'd-render'
import PluginStandard from '@d-render/plugin-standard'
import 'd-render/dist/index.css'


/** 文档站仅在浏览器动态加载示例后调用，用于注册标准插件与样式 */
import CodeBlock from '../../components/CodeBlock.vue'
const dRender = new DRender()
dRender.setConfig({ plugins: [PluginStandard] })

function clientOnlyDemo (loader: () => Promise<{ default: object }>) {
  return defineComponent({
    name: 'ClientOnlyDemo',
    setup () {
      const Inner = shallowRef<object | null>(null)
      onMounted(() => {
        void loader().then((m) => {
          Inner.value = m.default
        })
      })
      return () =>
        Inner.value
          ? h(Inner.value as never)
          : h('div', { class: 'demo-placeholder' }, '示例加载中…')
    }
  })
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 可以在这里添加布局插槽
    })
  },
  enhanceApp ({ app }) {
    app.use(ElementPlus)

    app.component(
      'FormBasicDemo',
      clientOnlyDemo(() => import('../../components/FormBasicDemo.vue'))
    )
    app.component(
      'FormDependonDemo',
      clientOnlyDemo(() => import('../../components/FormDependonDemo.vue'))
    )
    app.component(
      'SearchFormDemo',
      clientOnlyDemo(() => import('../../components/SearchFormDemo.vue'))
    )
    app.component(
      'TableDemo',
      clientOnlyDemo(() => import('../../components/TableDemo.vue'))
    )
    app.component(
      'CascadeDemo',
      clientOnlyDemo(() => import('../../components/CascadeDemo.vue'))
    )
    app.component('CodeBlock', CodeBlock)
  }
} satisfies Theme
