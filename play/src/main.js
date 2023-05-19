import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/antd.min.css'
import { DRender } from 'd-render'
import 'd-render/dist/index.css'
import dRenderConfig from '../d-render.config'

const dRender = new DRender()
dRender.setConfig(dRenderConfig)
createApp(App).use(router).mount('#app')
