import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.css'

// 导入示例组件
import FormBasicDemo from '../../components/FormBasicDemo.vue'
import FormDependonDemo from '../../components/FormDependonDemo.vue'
import SearchFormDemo from '../../components/SearchFormDemo.vue'
import TableDemo from '../../components/TableDemo.vue'
import CodeBlock from '../../components/CodeBlock.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 可以在这里添加布局插槽
    })
  },
  enhanceApp({ app }) {
    // 注册 Element Plus
    app.use(ElementPlus)

    // 注册全局组件
    app.component('FormBasicDemo', FormBasicDemo)
    app.component('FormDependonDemo', FormDependonDemo)
    app.component('SearchFormDemo', SearchFormDemo)
    app.component('TableDemo', TableDemo)
    app.component('CodeBlock', CodeBlock)
  }
} satisfies Theme
