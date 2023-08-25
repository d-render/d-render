export default {
  props: {
    list: Array
  },
  setup (props) {
    return () => <div>
      {JSON.stringify(props.list)}
    </div>
  }
}
