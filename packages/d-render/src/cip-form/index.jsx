import { h, ref, toRefs, computed } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import {
  toUpperFirstCase,
  getFieldValue,
  useFormProvide,
  DRender,
  useCipPageConfig, isEmpty
} from '@d-render/shared'
import { useConfig, useComponentProps } from '@xdp/config'
import CipFormItem from '../cip-form-item'
import CipFormDirectory from './form-directory'
import CipFormLayout from '../cip-form-layout'
const dRender = new DRender()
export default {
  name: 'CipForm',
  props: {
    model: Object,
    fieldList: Array,
    showOnly: Boolean,
    modelKey: {
      type: [String, Function]
    },
    grid: { type: [Number, Boolean] }, // 是否开启grid布局
    useDirectory: Boolean,
    labelPosition: String,
    scrollToError: {
      type: Boolean,
      default: true
    },
    equipment: {
      type: String,
      default: 'pc',
      validate: (val) => ['pc', 'mobile'].includes(val)
    },
    border: { type: Boolean, default: undefined }, // showOnly + border 将出现边框
    enterHandler: Function // 回车触发回调
  },
  emits: ['update:model', 'submit', 'cancel'],
  setup (props, context) {
    // 下发属性
    const uploadQueue = ref({})
    // const cipConfig = useCipConfig()
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

    const directoryConfig = ref([])
    const { fieldList } = toRefs(props)
    const cipFormRef = ref()
    // 修改model的值
    const updateModel = (val) => {
      context.emit('update:model', val)
    }
    const generateComponentKey = (key) => {
      if (props.modelKey) {
        const appendKey = toUpperFirstCase(key)
        if (typeof props.modelKey === 'function') {
          return `${props.modelKey(props.model)}${appendKey}`
        } else {
          const value = getFieldValue(props.model, props.modelKey)
          return `${value || ''}${appendKey}`
        }
      } else {
        return key
      }
    }
    // 获取layout及item组件需要的props
    const getComponentProps = (key, config) => {
      const componentKey = generateComponentKey(key)
      const componentProps = {
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
        'onUpdate:model': (val) => {
          if (componentKey === generateComponentKey(key)) {
            updateModel(val)
          }
        }
      }
      if (props.enterHandler) {
        componentProps.onKeyup = (e) => {
          const { keyCode } = e
          if (keyCode === 13) {
            props.enterHandler()
          }
        }
      }
      return componentProps
    }
    // 布局字段渲染方式
    const getFormLayout = (componentProps) => {
      return h(CipFormLayout, {
        ...componentProps,
        onValidate: (cb) => {
          validate(cb)
        },
        onSubmit: () => {
          context.emit('submit')
        },
        onCancel: () => {
          context.emit('cancel')
        }
      }, {
        item: ({ children = [], isShow } = {}) => {
          return children.map((v) => getFormDefaultSlot(v, isShow))
        }
      })
    }
    // 输入字段渲染方式
    const getFormItem = (componentProps) => {
      return h(CipFormItem, componentProps)
    }
    // 渲染单个字段
    const getFormDefaultSlot = ({ key, config } = {}, isShow) => {
      // 若存在字段key值的插槽覆盖则配置整个ElFormItem
      config._isGrid = grid.value
      config._isShow = isShow
      if (context.slots[key]) {
        return context.slots[key]({ key, config })
      }
      const componentProps = getComponentProps(key, config)
      // 若存在字段key值+Input的插槽覆盖则配置ElFormItem内的Input
      if (context.slots[`${key}Input`]) {
        return h(CipFormItem, {
          ...componentProps,
          customSlots: context.slots[`${key}Input`]
        })
      }
      // 判断是否为布局类型的字段
      if (dRender.isLayoutType(config.type)) {
        // layout类型字段
        return getFormLayout(componentProps)
      } else {
        // input类型字段
        // 如果需要表单目录导航则添加
        if (config.directory) {
          directoryConfig.value[key] = { label: config.staticInfo || config.label, level: config.directory }
        }
        return getFormItem(componentProps)
      }
    }
    // 渲染表单
    const getFormDefaultSlots = () => {
      if (formProps.value.useDirectory) {
        return fieldList.value.map((v) => getFormDefaultSlot(v)).concat(
          [h(CipFormDirectory, { directory: directoryConfig.value })]
        )
      } else {
        return fieldList.value.map((v) => getFormDefaultSlot(v))
      }
    }

    /** start父组件通过ref调用方法 **/
    const validateUpload = () => {
      return new Promise((resolve, reject) => {
        const keys = Object.keys(uploadQueue.value)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          if (uploadQueue.value[key]) {
            Message.value.error('请等待文件上传', '提示')
            resolve(false)
            break
          }
        }
        resolve(true)
      })
    }
    const validateField = (props, cb) => {
      return cipFormRef.value.validateField(props, cb)
    }
    const validate = async (cb = () => {}) => {
      const isUpload = await validateUpload()
      if (!isUpload) {
        // eslint-disable-next-line n/no-callback-literal
        cb(false)
        throw new Error('请等待文件上传')
      } else {
        // const res = await cipFormRef.value.validate() // 此方式返回的res为 true or false
        return new Promise((resolve, reject) => {
          cipFormRef.value.validate(async (isValid, invalidFields) => {
            if (typeof cb === 'function') cb(isValid, invalidFields)
            isValid ? resolve(isValid) : reject(isValid)
          })
        })
      }
    }
    const clearValidate = () => {
      return cipFormRef.value?.clearValidate()
    }

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
      style: { gridTemplateColumns: `repeat(${grid.value},1fr)` },
      size: 'default',
      // labelPosition: _labelPosition.value,
      scrollToError: formProps.value.scrollToError,
      onSubmit: ev => { ev.preventDefault() }
    }, { default: () => [getFormDefaultSlots(), context.slots.default?.()] })
  }
}
