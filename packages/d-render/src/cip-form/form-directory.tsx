import { computed, h, ref, defineComponent, PropType } from 'vue'
import { ElDrawer, ElIcon } from 'element-plus'
import { List } from '@element-plus/icons-vue'
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
    const DynamicHead = ({ config }: { config: IDir }) => {
      return h('a', { href: `#${config.key}`, class: 'form-directory-item' }, [
        h('h' + config.config.level, {}, [config.config.label])
      ])
    }
    return () => <>
      <div class={'form-directory__switch'} onClick={() => openDrawer()}>
        <ElIcon style={'font-size: 24px'}>
          <List />
        </ElIcon>
      </div>
      <ElDrawer custom-class={'form-directory__drawer'} v-model={drawerSwitch.value} title={'表单目录'}>
        <div class={'form-directory'}>
          {list.value.map(v => {
            return (<DynamicHead key={v.key} config={v}/>)
          })}
        </div>
      </ElDrawer>
    </>
  }
})
