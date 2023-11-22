// config.js
import { generateFieldList, defineFormFieldConfig } from 'd-render'
export const formFieldList = generateFieldList(defineFormFieldConfig({
  a: {
    label: 'A',
    required: true
  },
  b: {
    label: 'B',
    dependOn: [{
      key: 'a',
      effect: {
        changeValue ({ a }) {
          console.log('props execute B changeValue', a)
          return {
            value: a + '1'
          }
        }
      }
    }]
  }
}))
