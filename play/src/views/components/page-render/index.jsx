import { ref, watch } from 'vue'
import PageRender from '@/components/page-render'
import { pageSchemeService } from '@/api'
export default {
  props: {
    id: [Number, String] // 支持uuid 数字id
  },
  setup (props) {
    const pageScheme = ref({})
    const model = ref({
    })
    const getPageScheme = (val) => {
      pageSchemeService.info({ id: val }).then(res => {
        pageScheme.value = res.data.scheme
      })
    }

    // 根据id获取页面scheme
    watch(() => props.id, (val) => {
      getPageScheme(val)
    }, { immediate: true })

    return () => <div>
      <PageRender v-model:model={model.value} onUpdate:model={(val) => {
        model.value = val
      }} scheme={pageScheme.value}/>
    </div>
  }
}
