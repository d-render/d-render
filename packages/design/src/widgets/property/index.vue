<template>
  <div class="form-property">
    <config-tabs v-model:active="activeType" :group-list="groupList"></config-tabs>
    <div class="config-form-wrapper">
        <div v-show="activeType === 'field' && !selectItem?.id" class="empty-form--text">请添加字段</div>
        <cip-form v-show="activeType === 'field' && selectItem.id"
                  label-position="top"
                  :model="itemConfig"
                  @update:model="updateSelectItem"
                  :field-list="fieldComponentConfigureFieldConfigList"
                  model-key="id">
          <template #labelWidthInput="{fieldKey, updateModel}">
            <cip-input-switch :model-value="itemConfig[fieldKey]" @update:modelValue="updateModel">
              <template #input="{disabled, modelValue, updateModelValue}">
                <el-input-number :disabled="disabled"
                                 :modelValue="modelValue"
                                 :step="10"
                                 :min="0"
                                 controls-position="right"
                                 @update:modelValue="updateModelValue"></el-input-number>
              </template>
            </cip-input-switch>
          </template>
          <template #validateValueInput="{fieldKey, updateModel}">
            <cip-input-switch :model-value="itemConfig[fieldKey]" @update:modelValue="updateModel">
              <template #input="{disabled, modelValue, updateModelValue}">
                <el-select :disabled="disabled"
                           :model-value="modelValue"
                           @update:modelValue="updateModelValue"
                           placeholder="选择值类型"
                           clearable style="width:100%">
                  <el-option value="email" label="电子邮箱"></el-option>
                  <el-option value="mobilePhone" label="手机号"></el-option>
                  <el-option value="identityCard" label="身份证号"></el-option>
                </el-select>
              </template>
            </cip-input-switch>
          </template>
          <template #regexpValidateInput="{fieldKey, updateModel}">
            <cip-input-switch :model-value="itemConfig[fieldKey]" @update:modelValue="updateModel">
              <template #input="{disabled, modelValue, updateModelValue}">
                <el-input placeholder="填写正则表达式"
                          :disabled="disabled"
                          :model-value="modelValue"
                          @update:modelValue="updateModelValue"
                          clearable>
                </el-input>
              </template>
            </cip-input-switch>
          </template>
          <template #dependOnInput="{disabled, fieldKey, updateModel}">
              <el-select  multiple
                          :disabled="disabled"
                          :model-value="itemConfig[fieldKey]"
                          @update:modelValue="updateModel"
                          placeholder="选择数据依赖"
                          clearable style="width:100%">
                <el-option v-for="item in dependOnSelectList" :key="item.id" :value="item.key" :label="`${item.config.label}(${item.key})`"></el-option>
              </el-select>
          </template>
          <template #changeValueStrInput="{fieldKey, updateModel}">
            <code-mirror-dialog fn-name="changeValue" :fieldKey="fieldKey" :updateModel="updateModel" :itemConfig="itemConfig"/>
          </template>
          <template #valueChangeConfigInput="{updateModel}">
            <change-value-dialog
              :updateModel="updateModel"
              :itemConfig="itemConfig"
              :dependOnList="dependOnOptions"
              :isCurrentInTable="isCurrentInTable"
              @updateConfig="(val) => onConfigUpdate(val, 'value')"
            ></change-value-dialog>
          </template>
          <template #changeConfigStrInput="{fieldKey, updateModel}">
            <code-mirror-dialog fn-name="changeConfig" :fieldKey="fieldKey" :updateModel="updateModel" :itemConfig="itemConfig"/>
          </template>
          <template #configChangeConfigInput="{updateModel}">
            <change-config-dialog
              :updateModel="updateModel"
              :itemConfig="itemConfig"
              :dependOnList="dependOnOptions"
              :isCurrentInTable="isCurrentInTable"
              @updateConfig="(val) => onConfigUpdate(val, 'config')"
            ></change-config-dialog>
          </template>
        </cip-form>
        <cip-form v-show="activeType === 'form'"
                  label-position="top"
                  :model="data"
                  @update:model="updateData"
                  :field-list="formConfigFieldConfigList"></cip-form>
<!--        <cip-form v-show="activeType === 'column'"-->
<!--                  label-position="top"-->
<!--                  :model="tableConfig"-->
<!--                  @update:model="updateTableItem"-->
<!--                  :field-list="columnConfigFieldConfigList"-->
<!--                  :inline="false"></cip-form>-->
    </div>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { CipForm } from 'd-render'
import CipInputSwitch from '@cip/components/cip-input-switch'
import ConfigTabs from './config-tabs'
import { formConfigFieldConfigList, getComponentConfigure } from './config'
import { mergeFieldConfig, configMapToList, configureOptionsFieldConfigMap, defaultConfigureOptions } from '@d-render/shared'
import { ElInputNumber, ElSelect, ElOption, ElInput } from 'element-plus'
import CodeMirrorDialog from './code-mirror-dialog'
import { isLayoutType } from '../../../utils'
import ChangeValueDialog from './fn-config/change-value'
import ChangeConfigDialog from './fn-config/change-config'

export default {
  components: {
    CipForm,
    CipInputSwitch,
    ConfigTabs,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElInput,
    CodeMirrorDialog,
    ChangeValueDialog,
    ChangeConfigDialog
  },
  props: {
    selectItem: { type: Object, default: () => ({}) },
    data: Object
  },
  name: 'FormProperty',
  emits: ['update:data', 'update:selectItem', 'update:tableItem'],
  setup (props, { emit }) {
    const activeType = ref('field')
    const groupList = ref([
      { label: '字段配置', value: 'field' },
      { label: '表单配置', value: 'form' }
      // { label: '列表配置', value: 'column' }
    ])
    const itemConfig = computed(() => {
      const result = props.selectItem.config || {}
      result.key = props.selectItem.key
      result.id = props.selectItem.id
      return result
    })

    const getFieldComponentConfigureFieldConfigList = async (val) => {
      let configure
      try {
        configure = await getComponentConfigure(val)
      } catch (e) {
        // 若获取配置发生错误直接使用默认配置
        console.warn(`form-design: 获取${val}组件配置文件发生错误,使用默认配置进行替换`)
        configure = defaultConfigureOptions()
      }
      return configMapToList(mergeFieldConfig(configure, configureOptionsFieldConfigMap))
    }

    const fieldComponentConfigureFieldConfigList = ref([])
    watch(() => itemConfig.value.type, (val) => {
      if (val) {
        fieldComponentConfigureFieldConfigList.value = []
        // dependOn存在缓存问题，暂时先进行清空再赋值操作
        getFieldComponentConfigureFieldConfigList(val).then(res => {
          nextTick(() => {
            fieldComponentConfigureFieldConfigList.value = res
          })
        })
      } else {
        return []
      }
    }, { immediate: true })

    const tableConfig = computed(() => {
      return props.selectItem?.config?.tableItem ?? {}
    })
    const getOtherKeyItem = (item, otherKey) => {
      return {
        config: {
          label: item.config?.label
        },
        id: otherKey,
        key: otherKey
      }
    }
    const getDependOnSelectList = (list = [], keyList = [], totalFields = [], otherKeyList = [], isInTable = false) => {
      list.forEach((item) => {
        const type = item.config?.type
        if (isLayoutType(type)) {
          const options = item.config.options || []
          const children = options.map((option) => option.children).flat()
          getDependOnSelectList(children, keyList, totalFields, otherKeyList)
        } else if (type === 'table') {
          const options = item.config?.options
          if (options?.length) {
            getDependOnSelectList(options, keyList, totalFields, otherKeyList, true)
          }
        } else if ([
          'formCountersignPerson', 'roleDictionary', 'image', 'file',
          'divider', 'signature', 'formwork', 'editor',
          'resourceFormTable', 'staticInfo'
        ].includes(type)) {
          // 这些东西没必要依赖，什么也不做
        } else {
          if (isInTable) {
            item.config.isInTable = true
          }
          keyList.push(item)
          if (item?.config?.otherKey) {
            const otherKey = item.config.otherKey
            if (Array.isArray(otherKey)) {
              otherKeyList = [...otherKeyList, ...otherKey.map(key => getOtherKeyItem(item, key))]
            } else {
              otherKeyList.push(getOtherKeyItem(item, otherKey))
            }
          }
        }
      })
      return { keyList, otherKeyList }
    }
    const dependOnSelectList = computed(() => {
      const { keyList, otherKeyList } = getDependOnSelectList(props?.data?.list ?? [])
      return [...keyList, ...otherKeyList]
    })
    const dependOnOptions = computed(() => {
      const { keyList } = getDependOnSelectList(props?.data?.list ?? [])
      return [...keyList]
    })
    // 判断当前选中字段是否为子表单中的字段
    const isCurrentInTable = computed(() => {
      const { keyList, otherKeyList } = getDependOnSelectList(props?.data?.list ?? [])
      const curr = [...keyList, ...otherKeyList].find(item => item?.key === itemConfig.value?.key)
      return curr?.config?.isInTable ?? false
    })

    const updateData = (val) => {
      emit('update:data', val)
    }
    const updateSelectItem = (val) => {
      emit('update:selectItem', val)
    }
    const updateTableItem = val => {
      emit('update:tableItem', val)
    }
    const onActivated = (name) => {
      activeType.value = name
    }
    // 根据依赖修改值与配置的配置
    const onConfigUpdate = (value, type = 'value') => {
      if (type === 'value') {
        nextTick(() => {
          updateSelectItem({ ...props.selectItem.config, changeValueStr: value })
        })
      } else {
        nextTick(() => {
          updateSelectItem({ ...props.selectItem.config, changeConfigStr: value })
        })
      }
    }

    return {
      formConfigFieldConfigList,
      fieldComponentConfigureFieldConfigList,
      // columnConfigFieldConfigList,
      itemConfig,
      tableConfig,
      groupList,
      activeType,
      dependOnSelectList,
      dependOnOptions,
      isCurrentInTable,
      onActivated,
      updateData,
      updateSelectItem,
      updateTableItem,
      onConfigUpdate
    }
  }
}
</script>
