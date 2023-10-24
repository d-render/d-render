// disabled-table  // 判断是否可以放入table中的类名
export const componentsGroupList = [
  {
    groupName: 'basic',
    label: '基础字段',
    components: [
      { type: 'input', icon: 'el-icon-edit', label: '单行文本' },
      { type: 'textarea', icon: 'el-icon-edit', label: '多行文本' },
      { type: 'date', icon: 'el-icon-date', label: '日期' },
      { type: 'dateRange', icon: 'el-icon-date', label: '日期范围' },
      { type: 'time', icon: 'el-icon-time', label: '时间' },
      { type: 'timeRange', icon: 'el-icon-time', label: '时间范围' },
      { type: 'radio', icon: 'el-icon-document-checked', label: '单选框组', options: ['选项一', '选项二', '选项三'], display: 'inline-flex' },
      { type: 'checkbox', icon: 'el-icon-document-checked', label: '多选框组', options: ['选项一', '选项二', '选项三'], display: 'inline-flex' },
      { type: 'number', icon: 'el-icon-set-up', label: '计数器', min: 0, step: 1 },
      { type: 'numberRange', icon: 'el-icon-set-up', label: '计数区间', min: 0, step: 1, width: '100%' },
      { type: 'select', icon: 'el-icon-bottom', label: '下拉选择框', options: ['选项一', '选项二', '选项三'] },
      { type: 'switch', icon: 'el-icon-open', label: '开关' },
      { type: 'rate', icon: 'el-icon-star-off', label: '评分', max: 5 },
      { type: 'slider', icon: 'el-icon-s-operation', label: '滑块', max: 100, min: 0, step: 1 },
      { type: 'text', icon: 'el-icon-tickets', label: '文字', hideLabel: true, defaultValue: '这里是文字', fontWeight: 'normal', fontSize: 14, textAlign: 'left' }
    ]
  },
  {
    groupName: 'advance',
    label: '高级字段',
    components: [
      { type: 'file', icon: 'el-icon-folder', label: '文件' },
      { type: 'image', icon: 'el-icon-picture-outline', label: '图片' },
      { type: 'editor', icon: 'el-icon-edit-outline', label: '编辑器' },
      { type: 'editorReadonly', icon: 'el-icon-edit-outline', label: '编辑器(只读)' },
      { type: 'dataDictionary', icon: 'el-icon-data-analysis', label: '数据字典' },
      { type: 'roleDictionary', icon: 'el-icon-data-analysis', label: '角色' },
      { type: 'staff', icon: 'el-icon-user', label: '人员' },
      { type: 'office', icon: 'el-icon-office-building', label: '机构' },
      {
        type: 'table',
        icon: 'el-icon-menu',
        label: '子表单',
        hideLabel: true,
        hideBorder: false,
        options: [
          {
            key: 'default',
            children: []
          }
        ]
      },
      {
        type: 'flashFill',
        icon: 'el-icon-edit',
        label: '快速填充'
      }
    ]
  },
  {
    groupName: 'layout',
    label: '布局字段',

    components: [
      {
        class: 'disabled-table',
        type: 'grid',
        icon: 'el-icon-s-grid',
        label: '栅格布局',
        gutter: 0,
        options: [
          {
            span: 12,
            children: []
          },
          {
            span: 12,
            children: []
          }
        ]
      },
      {
        class: 'disabled-table',
        type: 'divider',
        icon: 'el-icon-minus',
        label: '分割线',
        width: '100%',
        contentPosition: 'center',
        dividerColor: '#ddd',
        textColor: '#333',
        hideLabel: true
      }
    ]
  }
]
