import { computed, defineAsyncComponent, defineComponent, inject } from 'vue'
import { Rank, DocumentCopy, Delete } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { isLayoutType } from '@/util'
import { useNamespace } from '@d-render/shared'
// import './content.less'
export default defineComponent({
  props: {
    selectId: {
      type: [String, Number],
      default: ''
    },
    onClick: {
      type: Function,
      default: () => () => {}
    },
    onUpdateConfig: {
      type: Function,
      default: () => () => {}
    },
    onDelete: {
      type: Function,
      default: () => () => {}
    },
    onCopy: {
      type: Function,
      default: () => () => {}
    },
    onSelectItem: {
      type: Function,
      default: () => () => {}
    },
    element: {
      type: Object,
      default: () => ({})
    },
    showCopy: {
      type: Boolean,
      default: true
    }
  },
  emits: ['changeHoverId'],
  setup (props, { attrs, emit }) {
    const ns = useNamespace('design-draw-content')
    // 获取渲染所需要的组件
    const getFormContentComponent = (type) => {
      return defineAsyncComponent(() => import(`./${type}`))
    }
    const getComponentType = (element) => {
      const { config: { type } } = element
      if (type === 'table') {
        return 'table'
      } else if (isLayoutType(type)) {
        return 'layout'
      } else {
        return 'item'
      }
    }
    // 配置组件props
    const formContentProps = computed(() => ({
      isActive: props.selectId === props.element.id,
      fieldKey: props.element.key,
      selectId: props.selectId,
      config: { ...(props.element?.config ?? {}), hideItem: false }, // 劫持 hideItem 强制修改为false //将背景色修改为红色
      showCopy: props.showCopy,
      'onUpdate:config': props.onUpdateConfig,
      onClick: props.onClick,
      onDelete: props.onDelete,
      onCopy: props.onCopy,
      onSelectItem: props.onSelectItem
    }))
    const itemFieldKey = computed(() => {
      const fieldKey = formContentProps.value.fieldKey
      const otherKey = formContentProps.value.config.otherKey
      const fieldKeyTotalName = [fieldKey].concat(otherKey).filter(v => !!v).join('-')
      return fieldKeyTotalName
    })
    const type = computed(() => getComponentType(props.element))
    const FormContent = computed(() => getFormContentComponent(type.value))
    const { entryElement, leaveElement, currentHoverId } = inject('designDrawing', {})
    return () => <div
      {...props}
      {...attrs}
      class={[
        ns.b(),
        ns.e(type.value),
        formContentProps.value.config.class,
        {
          [ns.is('hover')]: currentHoverId.value === props.element.id,
          [ns.is('active')]: formContentProps.value.isActive,
          // 'is-active': formContentProps.value.isActive,
          [ns.m('hidden')]: props.element.config?.hideItem
          // 'form-drawing--hidden': props.element.config?.hideItem
        }
      ]}
      onMouseenter={() => { entryElement(props.element.id) }}
      onMouseleave={() => { leaveElement(props.element.id) }}
      style={{ gridColumn: `span ${props.element.config?.span || 1}` }}
    >
      {props.selectId === props.element.id && <span class="right-top item-field-key"> {itemFieldKey.value}</span>}
      <ElIcon size={22} class={'show-focus handle-icon move-icon'}>
        <Rank/>
      </ElIcon>
      {/* <i class={'el-icon-rank show-focus handle-icon move-icon'} /> */}
      <div class="right-bottom show-focus">
        {formContentProps.value.showCopy && <ElIcon
          size={22}
          class={'handle-icon'}
          onClick={(e) => {
            e.stopPropagation()
            formContentProps.value.onCopy(e)
          }}>
          <DocumentCopy />
        </ElIcon> }
        <ElIcon
          class="handle-icon"
          size={22}
          onClick={(e) => {
            e.stopPropagation()
            formContentProps.value.onDelete(e)
          }}>
          <Delete />
        </ElIcon>
      </div>
      <FormContent.value { ...formContentProps.value }/>
    </div>
  }
})
