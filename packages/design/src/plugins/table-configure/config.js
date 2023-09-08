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
  height: {
    label: '表格高度',
    type: 'number',
    defaultValue: 400
  },
  tableColumnStatus: {
    type: 'switch',
    label: '是否只读',
    defaultValue: 'writable',
    activeValue: 'writeable',
    inactiveValue: 'readable'
  }
}
export const formConfigFieldConfigList = configMapToList(formConfigFieldConfigMap)
