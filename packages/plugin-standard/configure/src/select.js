export default {
  isObjectOption: {
    label: '待选项是否为对象',
    type: 'switch'
  },
  valueType: {
    label: '待选项值类型',
    type: 'radio',
    isButton: true,
    options: [
      { value: 'string', label: '字符' },
      { value: 'number', label: '数字' },
      { value: 'boolean', label: '布尔' }
    ]
  },
  options: {
    type: 'optionsConfigure',
    otherKey: ['isObjectOption', 'valueType']
  }
}
