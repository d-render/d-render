import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { computed } from 'vue'

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
  },
  emits: ['itemClick'],
  setup (props, { emit }) {
    const breadcrumb = computed(() => {
      return props.list.filter(item => item.key) || []
    })
    return () =>  <div class='dr-breadcrumb--container'>
        <ElBreadcrumb separator='>'>
          <ElBreadcrumbItem>页面</ElBreadcrumbItem>
          {
            breadcrumb.value.map(item => <ElBreadcrumbItem onClick={() => emit('itemClick', item)}>
              <a>{ item?.config?.label }</a>
            </ElBreadcrumbItem>)
          }
        </ElBreadcrumb>
      </div>
  }
}
