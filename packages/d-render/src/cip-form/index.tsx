import { h, ref, toRefs, computed, defineComponent, PropType, Ref, Slot, SlotsType, watch, VNode } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import {
  toUpperFirstCase,
  getFieldValue,
  useFormProvide,
  DRender,
  useCipPageConfig, isEmpty, IAnyObject, IFieldItem, TFormConfig
} from '@d-render/shared'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useConfig, useComponentProps } from '@xdp/config'
import CipFormItem from '../cip-form-item'
import CipFormDirectory, { IDirConfig } from './form-directory'
import CipFormLayout from '../cip-form-layout'
import { useLocale } from '../hooks/use-locale'
const dRender = new DRender()

interface IInputProps {
  key: string
  componentKey: string
  model?: IAnyObject
  fieldKey: string
  config: TFormConfig
  dataBus?: (key: string, val: unknown) => void
  readonly?: boolean
  grid: number | true
  formLabelPosition: 'top' | 'left' | 'right'
  labelPosition: 'top' | 'left' | 'right'
  errorMode?: 'default' | 'tooltip'
  changeCount: number
  'onUpdate:model': (val: IAnyObject) => void
  onKeyup?: (e: KeyboardEvent) => void
  customSlots?: Slot
}

export default defineComponent({
  name: 'CipForm',
  props: {
    model: Object as PropType<IAnyObject>,
    fieldList: Array as PropType<IFieldItem<TFormConfig>[]>,
    showOnly: Boolean,
    modelKey: {
      type: [String, Function]
    },
    grid: { type: [Number, Boolean] }, // 是否开启grid布局
    useDirectory: Boolean,
    labelPosition: String,
    labelWidth: [Number, String],
    labelSuffix: String,
    scrollToError: {
      type: Boolean,
      default: true
    },
    equipment: {
      type: String,
      default: 'pc',
      validate: (val: string) => ['pc', 'mobile'].includes(val)
    },
    dataBus: Function as PropType<(key: string, val: unknown) => void>,
    border: { type: Boolean, default: undefined }, // showOnly + border 将出现边框
    // 回车触发回调
    enterHandler: Function,
    errorMode: { type: String as PropType<'default' | 'tooltip'>, default: undefined },
    genNo: Function as PropType<(v: IFieldItem<TFormConfig>, count: number)=> (VNode | string)>
  },
  emits: ['update:model', 'submit', 'cancel'],
  slots: Object as SlotsType<{
    [propname: string]: IAnyObject | undefined
  }>,
  setup (props, context) {
    // 下发属性
    const uploadQueue:Ref<Record<string, boolean>> = ref({})
    // const cipConfig = useCipConfig()
    const { t } = useLocale()
    const xdpConfig = useConfig()
    const Message = computed(() => xdpConfig.message ?? ElMessage)
    const cipPageConfig = useCipPageConfig()
    const formPropsKey = [
      'border',
      'labelPosition',
      'useDirectory',
      'grid',
      'scrollToError'
    ]
    const formProps = useComponentProps(props, 'form', formPropsKey, [cipPageConfig])
    // grid为真时，pc和pad转换为3， 移动端强制转为1
    const grid = computed(() => {
      if (isEmpty(formProps.value.grid)) return undefined
      if (['pc', 'pad'].includes(props.equipment)) {
        if (formProps.value.grid === true) return 3
        return formProps.value.grid
      } else {
        return 1
      }
    })
    const labelPositionBridge = computed(() => {
      // [Broken]: 当表单出现border时强制修改labelPosition为right
      if (formProps.value.border && props.showOnly) {
        return 'right'
      }
      return formProps.value.labelPosition
      // return getUsingConfig(props.labelPosition, cipPageConfig.form?.labelPosition, cipConfig.form?.labelPosition)
    })

    useFormProvide(props, uploadQueue)

    const directoryConfig:Ref<IDirConfig> = ref({})
    const { fieldList } = toRefs(props)
    const cipFormRef = ref()
    // 修改model的值
    const updateModel = (val: IAnyObject) => {
      context.emit('update:model', val)
    }
    const generateComponentKey = (key: string) => {
      if (props.modelKey) {
        const appendKey = toUpperFirstCase(key)
        if (typeof props.modelKey === 'function') {
          return `${props.modelKey(props.model)}${appendKey}`
        } else {
          const value = getFieldValue(props.model ?? {}, props.modelKey)
          return `${value || ''}${appendKey}`
        }
      } else {
        return key
      }
    }
    // 获取layout及item组件需要的props
    const getComponentProps = (key: string, config: TFormConfig, id?: string) => {
      const componentKey = generateComponentKey(id || key)
      const componentProps: IInputProps = {
        key: componentKey,
        componentKey,
        model: props.model,
        fieldKey: key,
        config,
        dataBus: props.dataBus,
        readonly: props.showOnly,
        grid: grid.value,
        formLabelPosition: labelPositionBridge.value,
        labelPosition: labelPositionBridge.value,
        changeCount: changeCount.value, // 对象变化次数
        errorMode: props.errorMode,
        'onUpdate:model': (val: IAnyObject) => {
          if (componentKey === generateComponentKey(id || key)) {
            updateModel(val)
          }
        }
      }
      if (props.enterHandler) {
        componentProps.onKeyup = (e: KeyboardEvent) => {
          const { keyCode } = e
          if (keyCode === 13) {
            props.enterHandler?.()
          }
        }
      }
      return componentProps
    }
    // 布局字段渲染方式
    const getFormLayout = (componentProps: IInputProps) => {
      return h(CipFormLayout, {
        ...componentProps,
        onValidate: (cb: (isValid: boolean) => void) => {
          validate(cb)
        },
        onSubmit: () => {
          context.emit('submit')
        },
        onCancel: () => {
          context.emit('cancel')
        }
      } as any, {
        item: ({ children = [], isShow }: {children: IFieldItem<TFormConfig>[], isShow?: boolean} = { children: [] }) => {
          return children.map((v) => getFormDefaultSlot(v, isShow))
        }
      })
    }
    // inline 模式下换行包装函数
    const wrapWithInlineBreak = (node: VNode, br?: boolean) => {
      if (!br || grid.value) return node
      return [
        h('div', { class: 'cip-form-inline-br', key: `br__${String(node.key ?? '')}` }),
        node
      ]
    }
    // 输入字段渲染方式
    const getFormItem = (componentProps: IInputProps, br?: boolean) => {
      const node = h(CipFormItem, {
        ...componentProps,
        class: { 'cip-form-item--br': br }
      } as any)
      return wrapWithInlineBreak(node, br)
    }
    // 渲染单个字段
    const getFormDefaultSlot = ({ key, id, config, br }: IFieldItem<TFormConfig> = { key: '', config: {} }, isShow?: boolean) => {
      // 若存在字段key值的插槽覆盖则配置整个ElFormItem
      config._isGrid = grid.value
      config._isShow = isShow
      if (context.slots[key]) {
        return context.slots[key]({ key, config })
      }
      // 123
      const componentProps = getComponentProps(key, config, id)
      // 若存在字段key值+Input的插槽覆盖则配置ElFormItem内的Input
      if (context.slots[`${key}Input`]) {
        const node = h(CipFormItem, {
          ...componentProps,
          customSlots: context.slots[`${key}Input`],
          class: { 'cip-form-item--br': br }
        } as any)
        return wrapWithInlineBreak(node, br)
      }
      // 判断是否为布局类型的字段
      if (dRender.isLayoutType(config.type!)) {
        // layout类型字段
        return getFormLayout(componentProps)
      } else {
        // input类型字段
        // 如果需要表单目录导航则添加
        if (config.directory) {
          directoryConfig.value[key] = { label: (config.staticInfo || config.label) as string, level: config.directory as number }
        }
        return getFormItem(componentProps, br)
      }
    }
    // 渲染表单
    const getFormDefaultSlots = () => {
      // 在这里计算no
      const count = 0
      const list = fieldList.value?.map(v => {
        if (props.genNo) v.config.no = props.genNo(v, count)
        return v
      })
      if (formProps.value.useDirectory) {
        return list?.map((v) => getFormDefaultSlot(v)).concat(
          [h(CipFormDirectory, { directory: directoryConfig.value })]
        )
      } else {
        return list?.map((v) => getFormDefaultSlot(v))
      }
    }

    /** start父组件通过ref调用方法 **/
    const validateUpload = () => {
      return new Promise((resolve) => {
        const keys = Object.keys(uploadQueue.value)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          if (uploadQueue.value[key]) {
            Message.value.error(t('dr.form.waitingUpload'), t('dr.form.tip'))
            resolve(false)
            break
          }
        }
        resolve(true)
      })
    }
    const validateField = (props: Array<string>, cb: ()=> void) => {
      return cipFormRef.value.validateField(props, cb)
    }
    const validate = async (cb: (isValid: boolean, invalidFields?: unknown[]) => void) => {
      const isUpload = await validateUpload()
      if (!isUpload) {
        // eslint-disable-next-line n/no-callback-literal
        cb(false)
        throw new Error(t('dr.form.waitingUpload'))
      } else {
        // const res = await cipFormRef.value.validate() // 此方式返回的res为 true or false
        return new Promise((resolve, reject) => {
          cipFormRef.value.validate(async (isValid: boolean, invalidFields: unknown[]) => {
            if (typeof cb === 'function') cb(isValid, invalidFields)
            isValid ? resolve(isValid) : reject(isValid)
          })
        })
      }
    }
    const clearValidate = () => {
      return cipFormRef.value?.clearValidate()
    }
    const changeCount = ref(0) // model 整个对象变化的次数
    watch(() => props.model, () => {
      changeCount.value++
    }, { immediate: true })

    context.expose({
      validateUpload,
      validateField,
      validate,
      clearValidate
    })
    /** end父组件通过ref调用方法 **/
    return () => h(ElForm, {
      ...context.attrs,
      ref: cipFormRef,
      hideRequiredAsterisk: true,
      model: props.model,
      class: [
        'cip-form',
        `cip-form--${props.equipment}`,
        {
          'cip-form--grid': grid.value,
          'cip-form--border': formProps.value.border && props.showOnly,
          'cip-form--readonly': props.showOnly
        }
      ],
      style: { gridTemplateColumns: grid.value ? `repeat(${grid.value},1fr)` : undefined },
      size: 'default',
      // labelPosition: _labelPosition.value,
      labelWidth: labelPositionBridge.value === 'top' ? '100%' : props.labelWidth,
      labelSuffix: props.labelSuffix,
      scrollToError: formProps.value.scrollToError,
      errorMode: props.errorMode,
      onSubmit: (ev:Event) => { ev.preventDefault() }
    }, { default: () => [getFormDefaultSlots(), context.slots.default?.()] })
  }
})
