import { ref, defineAsyncComponent, computed, nextTick } from 'vue'
import { ElForm, ElFormItem, ElIcon, ElInput } from 'element-plus'
import LSelect from '@/widgets/select'
import { Plus, Minus, RemoveFilled } from '@element-plus/icons-vue'
import CipButtonText from '@cip/components/cip-button-text'
import CipDialog from '@cip/components/cip-dialog'
import { cloneDeep, DRender } from '@d-render/shared'
import RenderComponent from './render-component'
import { signs, multipleSign, logicSign } from '../config'
import { parseValueFn, parseConfigFn } from '../util'

export default {
  props: {
    fnType: String, // value：修改值, config：修改配置
    updateModel: Function,
    itemConfig: Object,
    dependOnList: Array,
    isCurrentInTable: Boolean // 当前字段是否为子表单内的字段
  },
  emits: ['updateConfig'],
  setup (props, { emit, slots }) {
    const visible = ref(false)
    const defaultConfig = {
      value: '',
      otherValue: '',
      config: {},
      conditions: [
        {
          source: '',
          sourceOtherKey: '',
          sign: '===',
          target: '',
          targetOtherValue: '',
          logic: '&&',
          type: 'input',
          isInTable: false // 是否是子表单字段
        }
      ]
    }
    const dependOnListOptions = computed(() => props.dependOnList?.filter?.(dep => {
      return props.itemConfig.dependOn?.includes?.(dep?.key)
    })?.map?.(({ key, config = {} }) => ({
      value: key,
      label: `${config?.label}(${key})`,
      ...config
    })))
    const getInitConfig = () => {
      if (props.fnType === 'value') {
        return props.itemConfig?.valueChangeConfig ?? [cloneDeep(defaultConfig)]
      } else {
        return props.itemConfig?.configChangeConfig ?? [cloneDeep(defaultConfig)]
      }
    }
    const config = ref(cloneDeep(getInitConfig()))
    const addConfig = () => {
      config.value.push(cloneDeep(defaultConfig))
    }
    const removeConfig = (index) => {
      config.value.splice(index, 1)
    }

    // 获取组件
    const dRender = new DRender()
    const componentDictionary = dRender.componentDictionary
    const components = {}
    const getComponents = () => {
      for (const key of Object.keys(componentDictionary)) {
        components[key] = defineAsyncComponent(() => {
          const component = componentDictionary[key] ?? componentDictionary.input
          return component('/index')()
        })
      }
    }
    getComponents()

    const renderLogic = (condition) => (
      <LSelect
        v-model={condition.logic}
        config={{
          options: logicSign,
          clearable: false
        }}
      />

    )

    const renderSign = ({ type, sign, multiple }) => {
      let signOptions
      if (type === 'checkbox' || multiple) {
        signOptions = multipleSign
      } else if (['number', 'slider', 'rate'].includes(type)) {
        signOptions = signs
      } else {
        signOptions = signs.slice(0, 2)
      }
      return <LSelect
        v-model={sign}
        config={{
          options: signOptions,
          clearable: false
        }}
      />
    }

    const onSourceChange = (val, condition) => {
      const selectItem = dependOnListOptions.value.find(i => i.value === val)
      const { type = 'input', isInTable = false, otherKey, multiple } = selectItem
      condition.type = type
      condition.isInTable = isInTable
      condition.sourceOtherKey = otherKey
      condition.target = type === 'switch' ? true : ''
      condition.targetOtherValue = ''
      condition.multiple = multiple

      // 重新渲染 RenderComponent组件
      condition.hide = true
      nextTick(() => {
        condition.hide = false
      })
    }
    const renderSource = (condition) => (
      <LSelect
        v-model={condition.source}
        onChange={(val) => { onSourceChange(val, condition) }}
        config={{
          options: dependOnListOptions.value,
          clearable: false,
          placeholder: '请选择数据依赖'
        }}
      ></LSelect>
    )

    const renderTarget = (condition) => {
      const { source } = condition
      if (!source) {
        return <ElInput v-model={condition.target}></ElInput>
      }
      const sourceItem = props.dependOnList?.filter?.(dep => dep.key === source)[0]
      const { config } = sourceItem
      const TargetComponent = components[config.type]

      return <RenderComponent
        config={config}
        Component={TargetComponent}
        v-model:value={condition.target}
        v-model:otherValue={condition.targetOtherValue}
      ></RenderComponent>
    }

    const addCondition = (item) => {
      item.conditions.push({
        source: '',
        sign: '===',
        target: '',
        targetOtherValue: '',
        logic: '&&'
      })
    }
    const removeCondition = (item, index) => {
      item.conditions.splice(index, 1)
    }
    const renderConditions = (item) => {
      return item.conditions.map((condition, index) => <div class="change-value-box__row" key={index}>
        {item.conditions.length > 1 && index > 0 && <div class="cvb-logic">{renderLogic(condition)}</div>}
        <div class={{ 'cvb-source': true, 'no-logic': index === 0 }}>{renderSource(condition)}</div>
        <div class="cvb-sign">{renderSign(condition)}</div>
        <div class="cvb-target">{!condition.hide && renderTarget(condition)}</div>
        <div class="cvb-opt">
          { <CipButtonText onClick={() => addCondition(item)}><ElIcon><Plus/></ElIcon></CipButtonText> }
          { item.conditions.length > 1 && <CipButtonText onClick={() => removeCondition(item, index)}><ElIcon><Minus/></ElIcon></CipButtonText>}
        </div>
      </div>)
    }

    const renderSelect = (item) => {
      const _options = Object.entries(item.conditions[0]?.targetOtherValue || {}).map(item => {
        const [key, value] = item
        return {
          label: key,
          value: key
        }
      })
      const _config = {
        type: 'select',
        options: _options
      }
      const TargetComponent = components[_config.type]
      return <RenderComponent
        config={_config}
        Component={TargetComponent}
        v-model:value={item.value}
        v-model:otherValue={item.otherValue}
      ></RenderComponent>
    }
    const renderValues = (item) => {
      if (autoSelect.value) {
        item.autoSelect = true
        return renderSelect(item)
      } else {
        item.autoSelect = false
      }
      const _config = cloneDeep(props.itemConfig)
      const TargetComponent = components[_config.type]
      return <RenderComponent
        config={_config}
        Component={TargetComponent}
        v-model:value={item.value}
        v-model:otherValue={item.otherValue}
      ></RenderComponent>
    }

    const renderer = slots.renderValues ?? renderValues

    const onConfirm = (resolve, reject) => {
      props.updateModel(config.value)
      const fnStr = props.fnType === 'value'
        ? parseValueFn({
          config: config.value,
          isCurrentInTable: props.isCurrentInTable,
          currOtherKey: props.itemConfig.otherKey
        })
        : parseConfigFn({
          config: config.value,
          isCurrentInTable: props.isCurrentInTable,
          currOtherKey: props.itemConfig.otherKey
        })
      emit('updateConfig', fnStr)
      resolve()
    }
    const onCancel = () => {
      config.value = cloneDeep(getInitConfig())
    }
    const autoSelect = computed(() => {
      const _dependOn = props.itemConfig?.dependOn || []
      const _dependOnList = props?.dependOnList || []
      const isAutoSelect = _dependOnList.reduce((flag, current) => {
        if (_dependOn.includes(current.id) && current.config?.withObject) {
          flag = true
        }
        return flag
      }, false)
      return isAutoSelect
    })
    return () => <>
      <CipButtonText onClick={() => { visible.value = true }}>配置</CipButtonText>
      <CipDialog
        title="依赖数据值变动修改值"
        class="change-value"
        v-model={visible.value}
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        <ElForm labelWidth={90} labelPosition="left">
          {
            config.value.map((item, index) => (
              <div class="change-value-box" key={index}>
                {<ElIcon class="cvb-rm" onClick={() => removeConfig(index)}><RemoveFilled/></ElIcon> }
                <ElFormItem label='如果'>{renderConditions(item)}</ElFormItem>
                <ElFormItem label={props.fnType === 'value' ? '则修改值为' : '则修改配置'}>{renderer(item)}</ElFormItem>
              </div>
            ))
          }
          <CipButtonText onClick={addConfig}>添加条件</CipButtonText>
        </ElForm>
      </CipDialog>
    </>
  }
}
