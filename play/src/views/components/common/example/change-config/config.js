// config.js
import { generateFieldList, defineFormFieldConfig } from 'd-render'
export const formFieldList = generateFieldList(defineFormFieldConfig({
  _staticInfo: { type: 'staticInfo', staticInfo: 'Change Config' },
  a: {
    type: 'radio',
    label: 'AAA',
    options: [
      { value: 0, label: '不可见' },
      { value: 1, label: '可见' }
    ]
  },
  b: {
    label: 'B',
    dependOn: ['a'],
    hideItem: true,
    changeConfig: (config, { a }) => {
      config.hideItem = a === 1
      return config
    }
  },
  ta: {
    type: 'table',
    dependOn: ['a'],
    options: [
      {
        key: 'aa',
        config: {
          type: 'input',
          writable: true,
          outDependOn: ['a'],
          changeConfig: (config, values, outValues) => {
            console.log(config, values, outValues)
            return config
          }
        }
      }
    ]
  }
}))
