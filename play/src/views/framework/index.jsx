import { ref } from 'vue'
import CipMain from '@cip/components/main'
import '@cip/styles'
import { menuService } from '@/api'
import DRLogo from './logo'
import GithubLogo from './github-logo'
import store from '@cip/components/store'
import { ElIcon, ElLink } from 'element-plus'
import styles from './index.module.less'
export default {
  name: 'PageFramework',
  setup () {
    const menu = ref([])
    const initMenu = () => {
      menuService.tree().then(res => { menu.value = res.data })
    }
    store.dispatch('setAccountInfo', { userName: 'admin' })
    initMenu()
    return () => <CipMain
      theme={'light'}
      class={styles['cip-main']}
      navMenu={menu.value}
      withTabs={true}
      hideFooter={true}
      layout={'left-2'}
      homeView={{ fullPath: '/' }}
    >
      {{
        name: ({ isCollapse }) => <div>
          <ElIcon style={'color: var(--el-color-warning); font-size: 30px;vertical-align: top'} >
            <DRLogo />
          </ElIcon>
          {!isCollapse && <span style={'margin-left: 8px'}>DRender Docs</span>}
        </div>,
        'header-plugin': () => <ElLink
          href={'https://github.com/d-render/d-render'}
          type="info"
          underline={false}
          target={'_blank'}>
          <ElIcon style={'font-size: 30px;'}><GithubLogo/></ElIcon>
        </ElLink>,
        'header-user': () => <div></div>
      }}
    </CipMain>
  }
}
