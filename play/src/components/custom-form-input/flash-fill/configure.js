import { basicInputConfigureOptions } from '@d-render/shared'

export default {
  ...basicInputConfigureOptions(),
  placeholder: {},
  required: {},
  requiredErrorMessage: {},
  api: {
    label: '接口',
    placeholder: '相对路径',
    type: 'select',
    defaultValue: '/basic',
    configSort: 4.1,
    asyncOptions: () => {
      return [
        { label: '基础数据', value: '/basic' }
      ]
    }
  },
  fieldMapping: {
    label: '字段映射',
    type: 'fieldMapping',
    otherKey: ['api', 'key', 'otherKey'],
    configSort: 4.2
  }
}
