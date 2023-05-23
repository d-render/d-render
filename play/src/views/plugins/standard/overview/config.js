import { generateFieldList, defineFormFieldConfig, cloneDeep } from '@d-render/shared'
import { h } from 'vue'
import { ElTag } from 'element-plus'
const base = defineFormFieldConfig({
  default: { type: 'default', label: '默认', required: true },
  autocomplete: {
    type: 'autocomplete',
    label: '自动补全输入框',
    fetchSuggestions: (query, cb) => {
      if (query) {
        // eslint-disable-next-line n/no-callback-literal
        cb([{ value: `${query}111` }])
      } else {
        // eslint-disable-next-line n/no-callback-literal
        cb([])
      }
    },
    required: true
  },
  cascader: {
    type: 'cascader',
    label: 'cascader',
    required: true,
    options: [
      {
        label: 'level-1',
        value: '1',
        children: [
          {
            label: 'level-1_1',
            value: '1_1'
          },
          {
            label: 'level-1_2',
            value: '1_2'
          }
        ]
      }
    ]
  },

  checkbox: {
    type: 'checkbox',
    label: 'checkbox',
    dependOn: ['isCheckboxButton'],
    required: true,
    span: 12,
    options: [
      { value: 'bj', label: '北京' },
      { value: 'sh', label: '上海' },
      { value: 'hz', label: '杭州' }
    ],
    changeConfig: (config, { isCheckboxButton }) => {
      config.isButton = isCheckboxButton
      return config
    }
  },
  isCheckboxButton: {
    type: 'switch',
    label: '切换checkbox',
    span: 12
  },
  color: { type: 'color', label: 'color picker', required: true },
  date: { type: 'date', label: 'date picker', required: true },
  datetime: { type: 'date', inputType: 'datetime', label: 'datetime picker', required: true },
  input: { type: 'input', label: 'input', required: true },
  number: { type: 'number', label: 'input number', required: true },
  radio: {
    type: 'radio',
    label: 'radio',
    required: true,
    span: 12,
    options: [
      { value: 'bj', label: '北京' },
      { value: 'sh', label: '上海', disabled: true },
      { value: 'hz', label: '杭州' }
    ],
    optionProps: {
      slots: {
        default: ({ option }) => {
          return h('div',
            null,
            [
              option.label,
              h(ElTag, null, { default: () => option.value })
            ])
        }
      }
    },
    dependOn: ['isRadioButton'],
    changeConfig: (config, { isRadioButton }) => {
      config.isButton = isRadioButton
      return config
    }
  },
  isRadioButton: {
    type: 'switch',
    label: '切换radio',
    span: 12
  },
  rate: { type: 'rate', label: 'rate', required: true },
  select: { type: 'select', label: 'select', required: true },
  slider: { type: 'slider', label: 'slider', required: true },
  switch: { type: 'switch', label: 'switch', required: true },
  time: { type: 'time', label: 'time picker', required: true },
  timeSelect: { type: 'timeSelect', label: 'time select', required: true },
  transfer: { type: 'transfer', label: 'transfer', required: true },
  tree: { type: 'tree', label: 'tree', required: true },
  treeSelect: { type: 'treeSelect', label: 'tree select', required: true },
  upload: { type: 'upload', label: 'upload', required: true }
})
export const elFormFieldConfig = generateFieldList(cloneDeep(base)).map(fieldConfig => {
  if (!fieldConfig.config.span) {
    fieldConfig.config.span = 24
  }
  return fieldConfig
})
