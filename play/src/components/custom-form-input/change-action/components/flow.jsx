import { defineComponent, onMounted, nextTick, ref, inject } from 'vue'
import { cloneDeep, throttle } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { CipForm } from 'd-render'
import { Graph } from '@antv/x6'
import CipDialog from '@cip/components/cip-dialog'
import NodeList from './node-list'
import {
  defaultData,
  edgeMarkupConfig,
  configList,
  getConfigure,
  START_NODE_ID,
  END_NODE_ID
} from '../config'
import '../index.less'

export default defineComponent({
  props: {
    data: {},
    fieldKey: {},
    componentType: {}
  },
  setup (props, ctx) {
    const graph = ref({})
    const currentEdge = ref({})
    const currentNode = ref({})
    const getSchema = inject('getSchema')

    const data = ref(props.data ?? cloneDeep(defaultData))

    const addNode = (node) => {
      const { source, target } = currentEdge.value
      const sourceIndex = data.value.nodes.findIndex(d => d.id === source)
      const targetNode = data.value.nodes[sourceIndex + 1]
      const left = data.value.nodes.splice(0, sourceIndex + 1) // 将需插入位置前面的节点缓存

      const id = uuid().substring(0, 8)
      // 新节点的位置放在原目标节点位置
      const newNode = {
        ...node,
        id,
        x: targetNode.id === END_NODE_ID ? targetNode.x - 40 : targetNode.x,
        y: targetNode.y,
        width: 160,
        height: 80,
        data: {
          ...node
        }
      }
      // 后续节点依次下移 160 = 新节点高度80 + 两边间距 40*2
      data.value.nodes.forEach(n => {
        n.y += 160
      })
      const newEdge = {
        ...currentEdge.value,
        source: id,
        target
      }

      currentEdge.value.target = id
      data.value.nodes = [...left, newNode, ...data.value.nodes] // 节点按顺序存储
      data.value.edges.push(newEdge)
      draw()
    }

    const draw = () => {
      data.value.edges.forEach(edge => {
        edge.tools = [{
          name: 'button',
          args: {
            markup: edgeMarkupConfig,
            distance: '50%',
            onClick ({ view }) {
              const source = view.sourceView.cell.id
              const target = view.targetView.cell.id
              // 引用 data里的数据方便添加节点是更改 target值
              currentEdge.value = data.value.edges.find(edge => {
                return edge.source === source && edge.target === target
              })
              open()
            }
          }
        }]
      })
      graph.value.fromJSON(data.value)
    }

    const init = () => {
      draw()
    }

    const onPositionChange = ({ current, node }) => {
      const nodeComp = data.value.nodes.find(n => n.id === node.id) ?? {}
      if (!nodeComp) return
      nodeComp.x = current.x
      nodeComp.y = current.y
    }

    const configTitle = ref('节点配置')
    const fieldList = ref([])
    const confVisible = ref(false)
    const configModel = ref({})
    const onNodeClick = async ({ node }) => {
      if ([START_NODE_ID, END_NODE_ID].includes(node.id)) return
      const schema = getSchema()
      currentNode.value = data.value.nodes.find(n => n.id === node.id)
      configTitle.value = currentNode.value.label
      configModel.value = {
        ...currentNode.value?.config,
        schema
      }
      if (node.data.type === 'config') {
        const res = await getConfigure(props.componentType)
        fieldList.value = res
      } else {
        fieldList.value = configList[node.data.type]
      }
      confVisible.value = true
    }
    const onConfirm = (resolve) => {
      // eslint-disable-next-line
      const { schema, ...config } = configModel.value
      currentNode.value.config = {
        ...config
      }
      resolve()
    }
    const onCancel = () => {
      configModel.value = {}
    }

    const visible = ref(false)
    const open = () => {
      visible.value = true
    }
    const onSelect = (node) => {
      addNode(node)
      visible.value = false
    }

    onMounted(() => {
      const parentEl = document.querySelector('.action-flow')
      nextTick(() => {
        graph.value = new Graph({
          container: document.getElementById('flow-container'),
          width: parentEl.offsetWidth,
          height: parentEl.offsetHeight,
          grid: true,
          translating: {
            restrict: true
          }
        })
        graph.value.on('node:change:position', throttle(onPositionChange, 100))

        graph.value.on('node:click', onNodeClick)

        // 删除节点
        graph.value.on('node:mouseenter', ({ node }) => {
          if ([START_NODE_ID, END_NODE_ID].includes(node.id)) return
          node.addTools({
            name: 'button-remove',
            args: {
              offset: { x: 160, y: 0 },
              onClick ({ view }) {
                const nodeId = view.cell.id
                const index = data.value.nodes.findIndex(item => item.id === nodeId)
                const nextNode = data.value.nodes[index + 1]
                if (index) {
                  data.value.nodes.splice(index, 1)
                  data.value.edges.forEach(edge => {
                    if (edge.target === nodeId) {
                      edge.target = nextNode.id
                    }
                  })
                  data.value.edges = data.value.edges.filter(edge => edge.source !== nodeId)
                  draw()
                }
              }
            }
          })
        })
        graph.value.on('node:mouseleave', ({ node }) => {
          node.removeTools()
        })

        init()
      })
    })

    const resolveData = () => {
      return { ...data.value }
    }
    ctx.expose({ resolveData })

    return () => (
      <div class="action-flow">
        <div id="flow-container"></div>
        <CipDialog
          title="选择节点"
          dialogType="drawer"
          width="400"
          closeOnClickModal={true}
          v-model={visible.value}
          showOnly={true}
        >
          <NodeList onSelect={onSelect}></NodeList>
        </CipDialog>

        <CipDialog
          title={configTitle.value}
          dialogType="drawer"
          width="400"
          closeOnClickModal={true}
          v-model={confVisible.value}
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          <CipForm
            labelPosition={'top'}
            model={configModel.value}
            fieldList={fieldList.value}
          />
        </CipDialog>
      </div>
    )
  }
})
