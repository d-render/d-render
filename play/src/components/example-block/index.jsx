import CipCodeMirror from '@cip/code-mirror'
import 'codemirror/mode/jsx/jsx'
import './index.less'
import Wrapper from './wrapper'
export default {
  name: 'ExampleBlock',
  props: {
    code: [String, Array]
  },
  setup (props, { slots }) {
    return () => <Wrapper>
      {{
        example: () => slots.default?.(),
        code: () => [].concat(props.code).map(v => <CipCodeMirror
          style={'max-height: 100vh'}
          modelValue={v}
          mode={'text/jsx'}
          readonly
          lineNumbers={false}
        />)
      }}
      </Wrapper>
  }
}
