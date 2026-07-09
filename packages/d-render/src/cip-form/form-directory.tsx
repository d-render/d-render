import { computed, h, ref, defineComponent, PropType } from 'vue'
import { ElDrawer, ElIcon } from 'element-plus'
import { List } from '@element-plus/icons-vue'
import { useLocale } from '../hooks/use-locale'
export interface IDirConfig {
  [propname: string]: {label: string, level: number }
}
 interface IDir {
  key: string
  config: {label: string, level: number }
}
export default defineComponent({
  props: {
    directory: {
      type: Object as PropType<IDirConfig>,
      required: true
    }
  },
  setup (props) {
    const { t } = useLocale()
    const drawerSwitch = ref(false)
    const openDrawer = () => {
      drawerSwitch.value = true
    }
    const list = computed(() => {
      const result:Array<IDir> = []
      Object.keys(props.directory).forEach(key => {
        result.push({ key, config: props.directory[key] })
      })
      return result
    })
    const renderHead = (item: IDir) => {
      return h('a', { key: item.key, href: `#${item.key}`, class: 'form-directory-item' }, [
        h('h' + item.config.level, {}, [item.config.label])
      ])
    }

    return () => <>
      <div class={'form-directory__switch'} onClick={() => openDrawer()}>
        <ElIcon style={'font-size: 24px'}>
          <List />
        </ElIcon>
      </div>
      <ElDrawer custom-class={'form-directory__drawer'} v-model={drawerSwitch.value} title={t('dr.form.directory')}>
        <div class={'form-directory'}>
          {list.value.map(v => {
            return renderHead(v)
          })}

        </div>
      </ElDrawer>
    </>
  }
})
