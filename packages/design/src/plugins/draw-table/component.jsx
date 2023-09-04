import { CipForm } from 'd-render'

export default {
  setup (props, { slots }) {
    return () => <CipForm>{slots.default?.()}</CipForm>
  }
}
