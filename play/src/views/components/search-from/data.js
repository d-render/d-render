export default {
  subTitle: '用于处理CURD中的搜索功能，其功能需要配置和d-render-plugin使用',
  props: [
    { prop: 'model(v-model:model)', type: 'Object', description: '数据', default: '-' },
    { prop: 'fieldList', type: '/types/searchFormFieldList', isLink: true, text: 'searchFormFieldList', description: '数据渲染方式配置', default: '[]' },
    { prop: 'grid', type: 'number | "auto"', description: '设置总列数,与form不同，不设置时searchForm会根据缩在容器的宽度自动调整列', default: 'auto' },
    {
      prop: 'labelPosition',
      type: 'boolean',
      description: '表单label的位置。当不设置该值时受cip-config-provide和cip-page-layout的主题控制',
      default: 'undefined',
      enableValue: 'left/right/top'
    },
    { prop: 'hideSearch', type: 'boolean', description: '是否隐藏搜索部分', default: 'false' },
    { prop: 'handleAbsolute', type: 'boolean', description: '处理部分是否使用绝对定位', default: 'undefined' },
    { prop: 'collapse', type: 'boolean', description: '是否超过一行自动收缩状态', default: 'true' },
    { prop: 'searchButtonText', type: 'string', description: '搜索按钮文字', default: 'undefined' },
    { prop: 'searchReset', type: 'boolean', description: '是否开启重置功能，受cip-config-provide控制', default: 'undefined' },
    { prop: 'equipment', type: 'pc/mobile', description: '设备类型', default: 'pc' },
    { prop: 'completeRow', type: 'boolean', description: '是否未完整的一行' },
    { prop: 'defaultModel', type: 'Object', description: '默认的搜索条件，重置时将会使用此搜索条件' }
  ],
  events: [
    { prop: 'search', params: '(val)', description: '搜索事件' }
  ]
}
