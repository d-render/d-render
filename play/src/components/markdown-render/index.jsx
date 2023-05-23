import 'github-markdown-css/github-markdown-light.css'
import './index.less'
export default {
  name: 'MarkDownRender',
  props: {
    source: String
  },
  setup (props) {
    return () => <div class={'markdown-wrapper'}>
      {/* markdown-body 此熟悉为github-markdown-css的命名空间 */}
      <div class={'markdown-body'} v-html={props.source}></div>
    </div>
  }
}
