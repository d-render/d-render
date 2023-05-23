import CipPageLayoutInfo from '@cip/components/page-layout/info'
// eslint-disable-next-line import/no-webpack-loader-syntax
import RawCode from '!!raw-loader!../example/change-value/base'
// eslint-disable-next-line import/no-webpack-loader-syntax
import RawConfig from '!!raw-loader!../example/change-value/config'
import ExampleCode from '../example/change-value/base'
import ExampleBlock from '@/components/example-block'
export default {
  name: 'CipFormGanged',
  setup () {
    return () => <CipPageLayoutInfo >
      <ExampleBlock code={[RawConfig, RawCode]}>
        <ExampleCode />
      </ExampleBlock>
    </CipPageLayoutInfo>
  }
}
