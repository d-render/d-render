export default {
  subTitle: '用于处理CURD中的新增、编辑及详情查看,比如当前看到的内容就是由CipForm渲染的, 其功能需要配和d-render-plugin使用',
  props: [
    { prop: 'model(v-model:model)', type: 'Object', description: '数据', default: '-' },
    { prop: 'fieldList', type: '/types/formFieldList', isLink: true, text: 'FormFieldList', description: '数据渲染方式配置', default: '[]' },
    { prop: 'grid', type: 'number', description: 'display:grid, 设置总列数', default: '1' },
    {
      prop: 'labelPosition',
      type: 'boolean',
      description: '表单label的位置。当不设置该值时受cip-config-provide和cip-page-layout的主题控制',
      default: 'undefined',
      enableValue: 'left/right/top'
    },
    { prop: 'border', type: 'boolean', description: '表单是否添加边框。当不设置该值时受cip-config-provide和cip-page-layout的主题控制', default: 'undefined' },
    { prop: 'showOnly', type: 'boolean', description: '是否为只读表单，true将所有组件状态修改为view组件', default: 'undefined' },
    { prop: 'scrollToError', type: 'boolean', description: '触发验证时，是否将将滚动到滚动到验证失败的位置', default: 'true' },
    { prop: 'equipment', type: 'pc/mobile', description: '当前设备类型', default: 'pc' },
    { prop: 'enterHandler', type: 'function', description: '回车触发事件，常见与登录框按回车直接发起登录请求', default: 'undefined' },
    { prop: 'useDirectory', type: 'boolean', description: '是否开启目录表单目录功能', default: 'undefined' }
  ],
  exposes: [
    { prop: 'validateUpload', type: 'Function', description: '对整个表单的上传中的内容进行验证。' },
    { prop: 'validateField', type: 'Function', description: '验证具体的某个字段。' },
    { prop: 'validate', type: 'Function', description: '对整个表单的内容进行验证。' },
    { prop: 'clearValidate', type: 'Function', description: '清理表单的验证信息。' }
  ]
}
