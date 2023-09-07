import CipNumber from '@cip/components/cip-number'
import CipInput from '@cip/components/cip-input'
export default {
  props: {
    option: {},
    valueType: {},
    isObjectOption: {}
  },
  setup (props, { emit }) {
    const updateObjectOption = (val, type) => {
      emit('update:option', { ...props.option, [type]: val })
    }
    return () => {
      const InputComp = props.valueType === 'number' ? CipNumber : CipInput
      return <div style={{ display: 'flex', margin: '8px 0', width: '100%' }}>
        {!props.isObjectOption && <InputComp style={{ width: '100%' }} modelValue={props.option} onUpdate:modelValue={(val) => emit('update:option', val)} />}
        {props.isObjectOption && < >
          <InputComp
            style={{ flex: 1 }}
            modelValue={props.option?.value}
            onUpdate:modelValue={(val) => updateObjectOption(val, 'value')}/>
          <CipInput
            style={{ marginLeft: '12px', flex: 1 }}
            modelValue={props.option?.label}
            onUpdate:modelValue={(val) => updateObjectOption(val, 'label')}
          />
        </>}
      </div>
    }
  }
}
