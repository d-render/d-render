import changeLog from 'd-render/CHANGELOG.md'
import MarkdownRender from '@/components/markdown-render'
import CipPageLayoutInfo from '@cip/components/page-layout/info'
export default {
  name: 'DRenderChangelog',
  setup () {
    return () => <CipPageLayoutInfo canBack={false}>
      <MarkdownRender source={changeLog}/>
    </CipPageLayoutInfo>
  }
}
