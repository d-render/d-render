import { ref } from 'vue'
import styles from './wrapper.module.less'
import CipButton from '@cip/components/cip-button'
export default {
  name: 'ExampleBlockWrapper',
  setup (props, { slots }) {
    const showCode = ref(false)
    const toggleCode = () => {
      showCode.value = !showCode.value
    }
    return () => <div class={styles.wrapper}>
      <div class={styles.example}>
        {slots.example?.()}
      </div>
      <div class={styles.handle}>
        <CipButton type={'primary'} text onClick={() => { toggleCode() }}>代码</CipButton>
      </div>
      { showCode.value && <div class={styles.code}>
        {slots.code?.()}
      </div>}
    </div>
  }
}
