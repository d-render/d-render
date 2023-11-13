import { defineComponent } from 'vue'
import { nodeList } from '../config'

export default defineComponent({
  emits: ['select'],
  setup (props, { emit }) {
    const onClick = (node) => {
      emit('select', node)
    }

    return () => (
      <div class="af-node-list">
        {
          nodeList.map((group, gIndex) => (
            <div
              key={gIndex}
              class="af-node-group"
            >
              <div class="ang-title">{group.groupName}</div>
              <div class="ang-main">
                {
                  group.nodes.map((node, index) => (
                    <div
                      key={index}
                      class="ang-main-item"
                      onClick={() => onClick(node)}
                    >
                      {node.label}
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    )
  }
})
