import { basicInputConfigureOptions } from '@d-render/shared'

export default {
  ...basicInputConfigureOptions(),
  placeholder: {},
  required: {},
  requiredErrorMessage: {},
  otherKey: {
    // readable: false,
    configSort: 4.02,
    defaultValue: 'otherKey',
    dependOn: ['fieldMapping'],
    changeValue: ({ fieldMapping }) => {
      console.log('%c%s', 'color: #07FCFB;', '[Testing]', 111)
      return {
        value: fieldMapping?.map(item => item.fieldKey).join(',') // ?? []
      }
    }
  },
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
    otherKey: ['schema', 'api', 'otherKey'],
    configSort: 4.2
  }
}
