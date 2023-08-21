import { generateFieldList } from 'd-render'

export const formFieldList = generateFieldList({
  collapse1: {
    type: 'collapse',
    active: ['inputParams', 'pageParams'],
    options: [
      {
        name: 'inputParams',
        title: '页面入参',
        children: generateFieldList({
          inputParams: {
            type: 'simpleCurd',
            dialogProps: {
              size: 'small'
            },
            formProps: {
              labelWidth: '80px',
              fieldList: generateFieldList({
                type: { label: '数据类型', required: true },
                name: { label: '变量名称', required: true },
                required: { label: '是否必填', type: 'switch' },
                defaultValue: { label: '默认值', type: '' },
                remark: { label: '描述', type: 'textarea' }
              })
            },
            infoRender: (h, { item, $index }) => h('div', {
              style: 'display: flex; justify-content: space-between;width: 100%;padding: 0 12px;border: 1px solid #ddd;'
            }, [
              h('div', null, [item.name]), h('div', null, [item.type])
            ]),
            itemType: '变量',
            itemKey: 'name'
          }
        })
      },
      {
        name: 'pageParams',
        title: '页面变量',
        children: generateFieldList({
          pageParams: {
            type: 'simpleCurd',
            dialogProps: {
              size: 'small'
            },
            formProps: {
              labelWidth: '80px',
              fieldList: generateFieldList({
                type: { label: '数据类型', required: true },
                name: { label: '变量名称', required: true },
                required: { label: '是否必填', type: 'switch' },
                defaultValue: { label: '默认值', type: '' },
                remark: { label: '描述', type: 'textarea' }
              })
            },
            infoRender: (h, { item, $index }) => h('div', {
              style: 'display: flex; justify-content: space-between;width: 100%;padding: 0 12px;border: 1px solid #ddd;'
            }, [
              h('div', null, [item.name]), h('div', null, [item.type])
            ]),
            itemType: '变量',
            itemKey: 'name'
          }
        })
      }
    ]
  }

})
