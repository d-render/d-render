import RateInput from './index'
export default function (props) {
  return <div style={[props.styles, 'display: flex;']}><RateInput {...props} style={'width:100%'} disabled={true}/>{props.modelValue || 0}</div>
}
