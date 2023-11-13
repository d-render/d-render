import { defineComponent, ref, inject } from 'vue'
import CipTree from '@cip/components/cip-tree'
import ExpressionEditor from '@/components/expression-editor'
import './expression-config.less'

export default defineComponent({
  props: {
    modelValue: {}
  },
  setup (props, { expose }) {
    const values = ref(props.modelValue)
    const resolveData = () => {
      return values.value
    }

    const treeRef = ref()
    const treeData = ref([])
    const getSchema = inject('getSchema')
    const schema = getSchema()
    const getTreeData = (list) => {
      if (!list) return []
      return list.map(item => {
        let children
        const { config } = item
        if (config.type === 'grid') {
          const d = config.options.map(o => o.children).flat()
          children = getTreeData(d)
        }
        return {
          label: config.label,
          type: config.type,
          key: item.key,
          children
        }
      })
    }
    const init = () => {
      treeData.value = getTreeData(schema.list)
    }
    init()

    const onNodeClick = ({ data }) => {
      const { type } = data
      if (type === 'grid') return
      console.log('%c%s', 'color: #07FCFB;', '[Testing]xx', data)
    }

    expose({
      resolveData
    })

    return () => (
      <div class="expression-config">
        <div class="expression-config-content">
          <div class="ec-title p8">
            <div>表达式</div>
          </div>
          <div class="ec-formula p8">
            <ExpressionEditor></ExpressionEditor>
          </div>
        </div>
        <div class="expression-config-var">
          <div class="ec-title p8">
            <div>变量</div>
          </div>
          <div class="ec-vars p8">
            <CipTree
              ref={treeRef}
              options={treeData.value}
              showButton={false}
              withScroll={true}
              onNodeClick={onNodeClick}
            ></CipTree>
          </div>
        </div>
      </div>
    )
  }
})
