import { computed, h, ref } from 'vue'
import { ElDrawer } from 'element-plus'
export default {
  props: {
    directory: Object
  },
  setup (props) {
    const drawerSwitch = ref(false)
    const openDrawer = () => {
      drawerSwitch.value = true
    }
    const list = computed(() => {
      const result = []
      Object.keys(props.directory).forEach(key => {
        result.push({ key, config: props.directory[key] })
      })
      return result
    })
    const DynamicHead = ({ config }) => {
      return h('a', { href: `#${config.key}`, class: 'form-directory-item' }, [
        h('h' + config.config.level, {}, [config.config.label])
      ])
    }
    return () => <>
      <div class={'form-directory__switch'} onClick={() => openDrawer()}>
        <i class={'el-icon-s-order'} style={'font-size: 24px'}/>
      </div>
      <ElDrawer custom-class={'form-directory__drawer'} v-model={drawerSwitch.value} title={'表单目录'}>
        <div class={'form-directory'}>
          {list.value.map(v => {
            return (<DynamicHead config={v}/>)
          })}
        </div>
      </ElDrawer>
    </>
  }
}
