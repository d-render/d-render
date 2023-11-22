import CipPageLayoutInfo from '@cip/page-layout/info'
// eslint-disable-next-line import/no-webpack-loader-syntax
import RawCode from '!!raw-loader!../example/change-config/base'
// eslint-disable-next-line import/no-webpack-loader-syntax
import RawConfig from '!!raw-loader!../example/change-config/config'
import ExampleCode from '../example/change-config/base'
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
