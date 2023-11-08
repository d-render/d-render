import { defineComponent, ref, inject } from 'vue'
import './index.less'

export default defineComponent({
  props: {
    modelValue: {}
  },
  setup (props, { expose }) {
    const editor = ref()
    const onFocus = (e) => {
    }
    const onBlur = (e) => {
      editor.value.focus()
    }
    return () => (
      <textarea
        ref={editor}
        class="exp-editor"
        contenteditable="plaintext-only"
        onFocus={onFocus}
        onBlur={onBlur}
      ></textarea>
    )
  }
})
