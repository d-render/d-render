export default {
  subTitle: '用于处理CURD中的列表展示, 基于其封装的form-type可以实现props部分的展示, 其功能需要配置和d-render-plugin使用',
  props: [
    { prop: 'data(v-model:data)', type: 'array', description: '数据', default: '-' },
    { prop: 'columns', type: '/types/tableFieldList', isLink: true, text: 'TableFieldList', description: '数据渲染方式配置', default: '[]' },
    { prop: 'size', type: 'small/default/large', description: 'table大小，当不设置该值时受cip-config-provide控制', default: 'undefined' },
    { prop: 'border', type: 'boolean', description: '表格是否添加边框。当不设置该值时受cip-config-provide和cip-page-layout的主题控制', default: 'undefined' },
    { prop: 'offset', type: 'Number', description: 'table第一行的偏移量', default: 'undefined' },
    { prop: 'hideIndex', type: 'boolean', description: '是否隐藏序号列', default: 'false' },
    { prop: 'indexFixed', type: 'boolean|"left"|"right"', description: '序号列是否悬浮，悬浮的位置', default: 'left' },
    { prop: 'height', type: 'string', description: 'table的固定高度设置', default: 'undefined' },
    { prop: 'selectType', type: '"checkbox"|"radio"', description: '开启选中功能，且控制单选还是多选', default: 'undefined' },
    { prop: 'selectable', type: 'function', description: '当selectType为checkbox时有效，function(row,index)', default: 'undefined' },
    { prop: 'selectRadio', type: 'string|number', description: '当selectType为radio且存在rowKey时有效，当前选择项的实际值', default: 'undefined' },
    { prop: 'selectLabel', type: 'string|number', description: '当selectType为radio且存在rowKey时有效，当前选择项行的展示值', default: 'undefined' },
    { prop: 'selectColumns', type: 'array', description: '当selectType为checkbox且存在rowKey时有效，当前选择项行', default: 'undefined' },
    { prop: 'rowKey', type: 'string|function', description: '每一行的唯一主键 可为空 为function时入参数为row', default: 'false' },
    { prop: 'treeProps', type: 'Object', description: '树型表格配置{ children: \'children\', hasChildren: \'hasChildren\' }', default: 'false' },
    { prop: 'defaultExpendAll', type: 'boolean', description: '是否默认展开全部', default: 'false' },
    { prop: 'tableHeaderLabel', type: 'string', description: 'table所有列是否添加一个父title', default: 'undefined' },
    { prop: 'withTableHandle', type: 'boolean', description: '是否需要自带的处理列', default: 'false' },
    { prop: 'handlerLimit', type: 'number', description: '处理按钮限制，超过此值后出现更多按钮，仅对withTableHandle为真后的$handle插槽生效', default: 3 },
    { prop: 'inForm', type: 'boolean', description: '是否封装为CipForm的input type组件', default: 'false' },
    { prop: 'fieldKey', type: 'string', description: 'CipForm下使用时的data所在的键值', default: 'undefined' },
    { prop: 'ruleKey', type: 'string', description: 'CipForm下当前data的检验规则key, 此处为空时使用fieldKey', default: 'undefined' },
    { prop: 'dependOnValues', type: 'Object', description: '封装为CipForm的input type组件时,需要此数据支持内部cell数据对外部的依赖', default: 'undefined' }
  ],
  events: [
    { prop: 'sort', params: '({prop, order})', description: '自定义排序事件' },
    { prop: 'update:selectColumns', params: '(selectRows)', description: '多选选中事件' }
  ],
  exposes: [
    { prop: 'cipTableRef', type: 'Ref<ElTable>', description: '对整个表单的上传中的内容进行验证。' }
  ]
}
