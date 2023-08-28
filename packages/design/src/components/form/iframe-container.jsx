import { onMounted, ref, createApp } from 'vue'
import DeviceContainer from '@/widgets/drawing/widgets/device-container'
export default {
  props: {},
  setup (props, { slots }) {
    const doc = ref(defaultDoc)
    const iframe$ = ref()
    onMounted(() => {
      iframe$.value.onload = () => {
        Array.from(document.head.childNodes).filter(v => v.nodeName === 'STYLE')
          .forEach(style => {
            iframe$.value.contentDocument.head.appendChild(style.cloneNode(true))
          })
        // styles.use()
        createApp({
          setup () {
            return () => slots.default?.()
          }
        }).mount(iframe$.value.contentDocument.getElementById('app'))
      }
    })
    const style = {
      margin: 'auto 0',
      pointerEvents: 'auto',
      width: '100%',
      height: '100%',
      border: 'none'
    }
    return () => <DeviceContainer>
      <iframe ref={iframe$} srcdoc={doc.value} style={style}></iframe>
    </DeviceContainer>
  }
}

const defaultDoc = `<html>
    <body>
        <div id="app"></div>
    </body>
</html>
`
