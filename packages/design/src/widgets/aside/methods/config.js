import { generateFieldList } from 'd-render'

export const methodsConfigFieldList = generateFieldList({
  methods: {
    type: 'simpleCurd',
    itemType: '方法',
    itemKey: 'name',
    infoRender: (h, { item }) => {
      return h('div', null, [item.name])
    },
    dialogProps: {
      size: 'default'
    },
    formProps: {
      fieldList: generateFieldList({
        name: { label: '方法名称' },
        body: { label: '接口地址', type: 'codeMirror', mode: 'javascript' }
      })
    }
  }

})
