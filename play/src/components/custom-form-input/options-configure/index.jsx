import { watch } from 'vue'
import { useFormInput, formInputEmits, formInputProps } from '@d-render/shared'
import OptionConfigure from './option-configure'
export default {
  props: formInputProps,
  emits: formInputEmits,
  setup (props, ctx) {
    const { proxyValue, proxyOtherValue, width } = useFormInput(props, ctx, { maxOtherKey: 2 })
    if (!proxyValue.value) proxyValue.value = []
    watch(() => proxyOtherValue[0].value, (val) => {
      console.log('proxyOtherValue', val)
      if (proxyValue.value[0]) {
        if (val) {
          if (typeof proxyValue.value[0] !== 'object') {
            proxyValue.value = proxyValue.value.map((v) => ({ value: v, label: v }))
          }
        } else {
          if (typeof proxyValue.value[0] === 'object') {
            proxyValue.value = proxyValue.value.map(v => v.value)
          }
        }
      }
    })
    const updateOption = (val, i) => {
      proxyValue.value[i] = val
    }

    return () => <div style={{ width: width.value }}>
      {
        proxyValue.value.map((option, i) => <div>
          <OptionConfigure
            option={option}
            onUpdate:option={(val) => updateOption(val, i)}
            isObjectOption={proxyOtherValue[0].value}
            valueType={proxyOtherValue[1].value}
          />
        </div>)
      }
    </div>
  }
}

// {/* {securityConfig.value.isObjectOption && <> */}
//       {/*  <div><span>值</span><span>标签</span></div> */}
//       {/*  <div> */}
//       {/*    <ElInput ></ElInput> */}
//       {/*    <ElInput ></ElInput> */}
//       {/*  </div> */}
//       {/* </>} */}
