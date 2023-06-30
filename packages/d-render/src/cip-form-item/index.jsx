import { ElFormItem, ElTooltip, ElIcon } from 'element-plus'
import { InfoFilled, WarningFilled } from '@element-plus/icons-vue'
import { h, toRef, computed, ref, unref, onErrorCaptured } from 'vue'
import { isEmpty, isEmptyObject, isInputEmpty, useFormInject, useElFormInject, useCipConfig } from '@d-render/shared'
import { useWatchFieldDepend } from './hooks/use-field-depend'
import { useFieldValue, useSteamUpdateValues } from './hooks/use-model-change'
import { useRules } from './hooks/use-field-rules'
import { isHideLabel, getLabelWidth, UpdateModelQueue, getInputComponent, getViewComponent, getH5InputComponent } from './util'
export default {
  name: 'CipFormItem',
  props: {
    config: Object, // 字段配置信息
    fieldKey: String, // 字段名
    model: { // 字段所属model
      type: Object,
      default: () => ({})
    },
    dataBus: Function,
    readonly: Boolean, // 是否只读-即查看模式
    customSlots: Function,
    showTemplate: { // 是否展示模版值[注：表单设计中使用]
      type: Boolean,
      default: false
    },
    tableDependOnValues: Object,
    inTable: {
      type: Boolean,
      default: false
    },
    componentKey: String,
    grid: [Number, Boolean],
    tableData: Array,
    labelPosition: {
      type: String,
      validate: (val) => ['top', 'right', 'left'].includes(val)
    },
    onSearch: Function, // 供CipSearchForm使用
    isDesign: Boolean, // 是否设计模式
    drawType: String // 需要开启设计模式后优先级高于config.type 一般仅用于拖拽设计时使用， 平时无效果
  },
  emits: ['update:model'],
  setup (props, context) {
    onErrorCaptured((e) => {
      // el-form-item 在onBeforeUnmount会访问el.value.firstElementChild 由于切换较快的原因会抱错
      process.env.NODE_ENV === 'development' && console.log(e)
      return false
    })
    // elForm组件实例
    const cipConfig = useCipConfig()
    const elForm = useElFormInject()
    const cipForm = useFormInject()
    const equipment = computed(() => {
      return unref(cipForm.equipment) || 'pc'
    })

    // 一般处于cip-table直接使用的情况下
    const notInForm = computed(() => {
      return isEmptyObject(elForm)
    })

    const updateModel = (value) => {
      // console.log('updateModel', value)
      // if (!notInForm.value) {
      //   // 因为延迟执行的问题，可能导致数据无法及时有效验证手动调用
      //   elForm.validateField([formItemConfig.value.ruleKey || props.fieldKey])
      // }
      context.emit('update:model', value)
    }

    const updateModelQueue = new UpdateModelQueue(() => props.model, updateModel)

    // FormItem及Input组件渲染模式 ['hidden','read','read-write']
    const status = computed(() => {
      // 为设置则默认开始可读可写模式
      const config = formItemConfig.value
      if (props.readonly) {
        if (config.readable === false) return 'hidden'
        return 'read'
      }
      if (isEmpty(config.readable) && isEmpty(config.writable)) {
        return 'read-write'
      }
      if (config.writable) {
        return 'read-write'
      } else if (config.readable) {
        return 'read'
      } else {
        return 'hidden'
      }
    })
    // Input组件实际使用的配置
    const formItemConfig = computed(() => {
      return runningConfig.value || props.config // handleFormConfig()
    })
    const model = toRef(props, 'model')
    const fieldKey = toRef(props, 'fieldKey')
    // 仅正对modelValue生效
    const changeEffect = computed(() => {
      return formItemConfig.value.changeEffect
    })

    // 3种数据更新方式并行
    // modelValue
    const [modelValue, updateModelValue] = useFieldValue(fieldKey, model, updateModelQueue, changeEffect)
    const otherKey = computed(() => formItemConfig.value?.otherKey)
    // otherValue
    const [otherValue, updateOtherValue] = useFieldValue(otherKey, model, updateModelQueue)

    const { values, streamUpdateModel, clearValues } = useSteamUpdateValues(fieldKey, otherKey, model, updateModel, changeEffect)
    // 监听依赖 触发响应事件
    const { changeCount, dependOnValues, outDependOnValues, runningConfig } = useWatchFieldDepend(props, context, { updateModelValue, updateOtherValue, clearValues })
    const readonly = toRef(props, 'readonly')
    // rules
    const { usingRules, rules } = useRules(formItemConfig, readonly, status, otherValue, dependOnValues, outDependOnValues)
    // Input组件是否展示标记(需要控制form-item内置的margin-bottom)
    const childStatus = ref(true)
    // FormItem label
    const formItemLabel = () => {
      // 隐藏label或者label为空时直接返回空字符串
      if (formItemConfig.value.hideLabel === true || isEmpty(formItemConfig.value.label)) return ''
      // 表单为只读模式下展示样式控制
      const labelId = formItemConfig.value.directory ? props.fieldKey : undefined
      const result = [h('span', { class: { 'is-readonly': props.readonly }, id: labelId }, [formItemConfig.value.label])]
      // 存在说明
      if (formItemConfig.value.description) {
        const descriptionComp = (
          <ElTooltip effect={formItemConfig.value.descriptionEffect || 'light'} placement={'top'}>
            {{
              content: () => formItemConfig.value.description,
              default: () => <ElIcon style={'margin-left:2px;line-height: inherit;'}><InfoFilled/></ElIcon>
            }}
          </ElTooltip>
        )
        result.push(descriptionComp)
      }
      // 仅在正在使用rules的input中且required为true时展示必填标记
      if (usingRules.value && formItemConfig.value.required) {
        const requiredAsterisk = (<span class={'cip-danger-color'}>*</span>)
        result.unshift(requiredAsterisk)
      }
      // 有标签后缀的增加标签后缀
      if (elForm.labelSuffix) {
        result.push(elForm.labelSuffix)
      }
      return h('div', {
        class: ['cip-form-item__label'],
        style: {
          width: '100%',
          ...formItemConfig.value.labelStyle
        }
      }, result) // result
    }
    const inlineErrorMessage = computed(() => {
      return props.inTable || cipForm.equipment === 'mobile'
    })
    // FormItem ErrorMessage
    const errorMessageNode = ({ error }) => {
      if (!inlineErrorMessage.value) return null
      return (
        <ElTooltip content={error}>
          <ElIcon class={'cip-danger-color '} style={{ outline: 'none', border: 'none' }}>
            <WarningFilled />
          </ElIcon>
        </ElTooltip>
      )
    }
    const labelPosition = computed(() => {
      // 依赖elForm实例数据总是在变换、故修改为有父组件cip-form下发数据
      if (!isEmpty(formItemConfig.value.labelPosition)) {
        return formItemConfig.value.labelPosition
      }
      if (props.labelPosition) return props.labelPosition
      return unref(cipForm.labelPosition) ?? 'right'
    })
    const isLabelPositionTop = computed(() => {
      return labelPosition.value === 'top'
    })
    const renderItemInput = () => {
      if (props.customSlots) {
        return props.customSlots({
          fieldKey: props.fieldKey,
          modelValue: modelValue.value,
          updateModel: updateModelValue, // 即将废弃，此处名字与实际功能不符合
          updateModelValue
        })
      }
      const type = props.isDesign
        ? props.drawType || formItemConfig.value.type || 'default'
        : formItemConfig.value.type || 'default'
      const componentProps = {
        key: props.componentKey,
        id: props.fieldKey,
        fieldKey: props.fieldKey,
        modelValue: modelValue.value,
        otherValue: otherValue.value,
        values: values.value,
        // model: model.value, // 即将废弃
        changeCount: changeCount.value,
        config: formItemConfig.value,
        usingRules: usingRules.value,
        rules: rules.value,
        dependOnValues: dependOnValues.value,
        outDependOnValues: outDependOnValues.value,
        dataBus: props.dataBus,
        disabled: formItemConfig.value.importantDisabled !== undefined
          ? formItemConfig.value.importantDisabled
          : formItemConfig.value.disabled,
        showTemplate: props.showTemplate,
        tableData: props.tableData,
        class: 'cip-form-item__input',
        onStatusChange: (status) => { // 子组件触发事件控制父组件是否显示
          childStatus.value = status
        },
        onSearch: props.onSearch
      }
      if (status.value === 'read-write') {
        const inputComponentProps = {
          ...componentProps,
          // 'onUpdate:modelValue': updateModelValue,
          // 'onUpdate:otherValue': updateOtherValue,
          'onStreamUpdate:model': (...args) => {
            streamUpdateModel(...args)
          }
        }
        if (unref(cipForm.equipment) === 'mobile') {
          return h(getH5InputComponent(type), inputComponentProps)
        } else {
          return h(getInputComponent(type), inputComponentProps)
        }
      } else {
        // 根据cip-config配置给view的modelValue添加默认值
        if (isInputEmpty(componentProps.modelValue)) {
          if (props.inTable && cipConfig.table.defaultViewValue) {
            componentProps.modelValue = cipConfig.table.defaultViewValue
          }
          if (cipConfig.defaultViewValue) {
            componentProps.modelValue = cipConfig.defaultViewValue
          }
        }
        return h(getViewComponent(type), componentProps)
      }
    }

    // FormItem
    const formItem = () => {
      return h(ElFormItem, {
        class: [
          `label-pos--${labelPosition.value}`,
          {
            'pos-top': isLabelPositionTop.value,
            // 'pos-top--padding': labelPositionTopPadding, 暂时关闭position === top时内容的缩进
            'hide-label': isHideLabel(formItemConfig.value),
            'content--end': formItemConfig.value.contentEnd
          }
        ],
        prop: formItemConfig.value.ruleKey || props.fieldKey, // 子表单内的输入框会生成一个ruleKey
        rules: rules.value,
        labelWidth: getLabelWidth(formItemConfig.value),
        inlineMessage: inlineErrorMessage.value
      }, {
        label: formItemLabel,
        error: errorMessageNode,
        default: renderItemInput
      })
    }
    const cipFormStyle = computed(() => {
      if (props.grid) {
        return { gridColumn: `span ${formItemConfig.value.span || 1}`, ...formItemConfig.value.itemStyle }
      } else {
        return (elForm.inline && !props.inTable) ? formItemConfig.value.style : formItemConfig.value.itemStyle
      }
    })
    return () => {
      if (status.value === 'hidden') return null
      if (props.inTable && status.value === 'read') return renderItemInput()
      // 父组件不存在form状态下的渲染方式 目前经为cip-table下直接渲染使用
      if (notInForm.value) return renderItemInput()
      return (
        <div
          style={cipFormStyle.value}
          class={[
            'cip-form-item',
            'el-form-item__wrapper',
            'ep-form-item__wrapper', // 支持namespace ep
            `cip-form-item--${equipment.value}`,
            {
              'cip-form-item--label-position-top': isLabelPositionTop.value,
              'cip-form-item--hidden': !childStatus.value || formItemConfig.value.hideItem,
              'cip-form-item--in-table': props.inTable,
              'cip-form-item--border': props.config.border !== false
            }
          ]}>
          {formItem()}
        </div>
      )
    }
  }
}
