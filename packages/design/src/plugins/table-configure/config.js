import { configMapToList } from '@cip/utils/config-util'
export const formConfigFieldConfigMap = {
  hideIndex: {
    type: 'switch',
    label: '是否显示序号',
    defaultValue: true
  },
  indexFixed: {
    type: 'switch',
    label: '序号是否固定',
    defaultValue: true
  },
  showSummary: {
    type: 'switch',
    label: '是否显示汇总',
    defaultValue: false
  },
  hideBorder: {
    type: 'switch',
    label: '是否显示边框',
    defaultValue: true
  },
  stripe: {
    type: 'switch',
    label: '是否显示斑马纹',
    defaultValue: true
  },
  tableColumnStatus: {
    type: 'switch',
    label: '是否只读',
    defaultValue: 'readable',
    activeValue: 'writable',
    inactiveValue: 'readable'
  },
  height: {
    label: '表格高度',
    type: 'number',
    defaultValue: 400
  }
}
export const formConfigFieldConfigList = configMapToList(formConfigFieldConfigMap)
