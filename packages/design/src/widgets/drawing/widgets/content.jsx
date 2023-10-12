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
    },
    grid: Number,
    Component: {}
  },
  emits: ['changeHoverId'],
  setup (props, { attrs, emit }) {
    const ns = useNamespace('design-draw-content')
    // 获取渲染所需要的组件
    const getFormContentComponent = (type) => {
      return defineAsyncComponent(() => import(`./${type}`))
    }
    const pageDeisgn = inject('pageDesign', {})
    const getComponentType = (element) => {
      const { config: { type } } = element
      const usingType = pageDeisgn.drawTypeMap?.[type] || type
      if (isLayoutType(usingType)) {
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
      grid: props.grid,
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
    const span = computed(() => {
      if (props.grid && props.element.config?.span) {
        return props.grid < props.element.config.span ? props.grid : props.element.config.span
      } else {
        return 1
      }
    })
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
      style={{ gridColumn: `span ${span.value || 1}` }}
    >
      {props.selectId === props.element.id && <span class="right-top item-field-key"> {itemFieldKey.value}</span>}
      <ElIcon size={22} class={'show-focus handle-icon move-icon'}>
        <Rank/>
      </ElIcon>
      {/* <i class={'el-icon-rank show-focus handle-icon move-icon'} /> */}
      <div class="right-bottom show-focus handle-icon">
        { props.Component && props.Component.map(icon => <icon.Component onClick={(e) => {
            e.stopPropagation()
            icon?.callback(props.element, e)
            }
          }/>)
        }
        {formContentProps.value.showCopy && <ElIcon
          onClick={(e) => {
            e.stopPropagation()
            formContentProps.value.onCopy(e)
          }}>
          <DocumentCopy />
        </ElIcon> }
        <ElIcon
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
