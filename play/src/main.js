import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/antd.min.css'
import { DRender, version } from 'd-render'
import 'd-render/dist/index.css'
import '@cip/styles'
import '@cip/cci-standard-theme'
import '@/style/global.less'
import dRenderConfig from '../d-render.config'

console.log('d-render', version)
const dRender = new DRender()
dRender.setConfig(dRenderConfig)
createApp(App).use(router).mount('#app')
