import { onMounted, ref, createApp } from 'vue'

export default {
  props: {},
  setup (props, { slots }) {
    const doc = ref(defaultDoc)
    const iframe$ = ref()
    onMounted(() => {
      iframe$.value.onload = () => {
        Array.from(document.head.childNodes).filter(v => v.nodeName === 'STYLE')
          .forEach(style => {
            console.log(style)
            console.log(style.cloneNode())
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
    return () => <iframe ref={iframe$} srcdoc={doc.value}></iframe>
  }
}

const defaultDoc = `<html>
    <body>
        <div id="app">hello world</div>
    </body>
</html>
`
