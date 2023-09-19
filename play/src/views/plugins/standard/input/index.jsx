import { CipForm } from 'd-render'
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import CipPageLayoutInfo from '@cip/page-layout/info'
export default {
  name: 'standardInput',
  setup () {
    const configAttrs = [
      ['size', ['small', 'default', 'large']],
      ['maxlength', [10]],
      ['minlength', [3]],
      ['showWordLimit', [true]],
      ['placeholder', ['请输入']],
      ['clearable', [true]],
      ['formatter', [(val) => val + 'formatter']],
      ['parser', []],
      ['disabled', [true]],
      ['prefixIcon', [Search]],
      ['suffixIcon', [Search]],
      ['readonly', [true]]
    ]
    const fieldList = configAttrs.map(([key, attrs]) => {
      return attrs.map(v => {
        return {
          key,
          config: {
            type: 'input',
            label: `config-${key}`,
            maxlength: 50,
            description: `${key}:${typeof v === 'object' ? '' : v}`,
            [key]: v
          }
        }
      })
    }).flat(1)
    const model = ref({})
    return () => <CipPageLayoutInfo theme={'dg'} title={'INPUT'}>
      <div style={'padding: 20px; box-sizing: border-box; background:#fff'}>
        <CipForm
          grid={3}
          v-model:model={model.value}
          fieldList={fieldList}
          labelPosition={'top'}
        />
      </div>
    </CipPageLayoutInfo>
  }
}
