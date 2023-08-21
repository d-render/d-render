import { basicInputConfigureOptions } from '@d-render/shared'
export default {
  ...basicInputConfigureOptions(),
  placeholder: {},
  defaultValue: {
    type: 'staticOptionsConfig',
    label: '静态数据',
    otherKey: 'options',
    limit: 20
  },
  required: {},
  requiredErrorMessage: {}
}
