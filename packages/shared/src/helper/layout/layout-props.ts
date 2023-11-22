import { ExtractPropTypes, PropType } from 'vue'
import { IRenderConfig, IAnyObject } from '../../utils'
export const layoutProps = {
  config: {
    type: Object as PropType<IRenderConfig>,
    default: () => ({})
  },
  fieldKey: {
    type: String
  },
  model: {
    type: Object as PropType<IAnyObject>,
    default: () => ({})
  },
  modelValue: {
    type: {} as PropType<unknown>
  }
}

export type LayoutProps = ExtractPropTypes<typeof layoutProps>
