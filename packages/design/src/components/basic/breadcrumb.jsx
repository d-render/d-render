import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { computed } from 'vue'

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    draw: {}
  },
  emits: ['itemClick'],
  setup (props, { emit }) {
    const breadcrumb = computed(() => {
      return props.list.filter(item => item.key && item.config) || []
    })
    const getLabel = (itemConfig) => {
      const { config } = itemConfig
      // 无config的已被上一步骤忽略
      // if (!config) {
      //   return `插槽，${key}`
      // } else {
      return config.label
      // }
    }
    return () => <div class='dr-breadcrumb--container'>
        <ElBreadcrumb separator='>'>
          <ElBreadcrumbItem>{props.draw?.config?.title}</ElBreadcrumbItem>
          {
            breadcrumb.value.map(item => <ElBreadcrumbItem
              onClick={() => emit('itemClick', item)}
            >
              <a>{ getLabel(item) }</a>
            </ElBreadcrumbItem>)
          }
        </ElBreadcrumb>
      </div>
  }
}
