import { generateFieldList, defineFormFieldConfig, cloneDeep } from '@d-render/shared'
import { h } from 'vue'
import { ElTag } from 'element-plus'
const treeOptions = [
  {
    value: '1',
    label: 'level_1',
    children: [
      { value: '1-1', label: 'level_1-1' },
      { value: '1-2', label: 'level_1-2' }
    ]
  },
  {
    value: '2',
    label: 'level_2',
    children: [
      { value: '2-1', label: 'level_2-1' },
      { value: '2-2', label: 'level_2-2' }
    ]
  },
  {
    value: '3',
    label: 'level_3'
  }
]
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
    options: treeOptions
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
  slider: { type: 'slider', label: 'slider', required: true },
  switch: { type: 'switch', label: 'switch', required: true },
  time: { type: 'time', label: 'time picker', required: true },
  timeSelect: { type: 'timeSelect', label: 'time select', required: true },
  transfer: { type: 'transfer', label: 'transfer', required: true },
  tree: { type: 'tree', label: 'tree', required: true },
  select: {
    type: 'select',
    label: 'select',
    realArray: true,
    multiple: true,
    otherKey: ['selectLabel', 'selectObject'],
    required: true,
    options: treeOptions
  },
  treeSelect: {
    type: 'selectTreeV2',
    // eslint-disable-next-line no-sparse-arrays
    // otherKey: [, , 'treeSelectPath'],
    label: 'tree select',
    options: treeOptions,
    multiple: true,
    showCheckbox: true,
    required: true
  },
  upload: { type: 'upload', label: 'upload', required: true }
})
export const elFormFieldConfig = generateFieldList(cloneDeep(base)).map(fieldConfig => {
  if (!fieldConfig.config.span) {
    fieldConfig.config.span = 24
  }
  return fieldConfig
})
