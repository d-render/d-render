<template>
  <div class="code-mirror-item">
    <div class="code-mirror-item_title" :closable="false" @click="visible = true">
      点击编辑{{ fnName }}函数
    </div>
    <cip-code-mirror
      readonly="nocursor"
      type="javascript"
      theme="default"
      :model-value="getCompleteFun(itemConfig[fieldKey])"
      @click="visible = true"></cip-code-mirror>
    <cip-dialog v-model="visible" title="函数编辑" :show-only="true">
      <el-alert :closable="false">
        function {{ fnName }}{{ paramsStr }} {
      </el-alert>
      <cip-code-mirror
        type="javascript"
        theme="default"
        :customHintOption="customHintOption"
        :model-value="itemConfig[fieldKey]"
        @update:model-value="updateModel"></cip-code-mirror>
      <el-alert :closable="false">}</el-alert>
    </cip-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { ElAlert } from 'element-plus'
import CipCodeMirror from '@cip/code-mirror'
import CipDialog from '@cip/components/cip-dialog'

export default defineComponent({
  components: { CipCodeMirror, CipDialog, ElAlert },
  props: {
    fnName: {},
    updateModel: {},
    itemConfig: {},
    fieldKey: {}
  },
  setup (props) {
    const visible = ref(false)
    const paramsStr = computed(() => {
      const paramsStrMap = {
        changeConfig: '(config, dependOnValues, outDependOnValues)',
        changeValue: '(dependOnValues, outDependOnValues)'
      }
      return paramsStrMap[props.fnName] ?? ''
    })
    const getCompleteFun = (funcBody) => {
      return `function ${props.fnName}${paramsStr.value} {
${funcBody ?? ''}
}`
    }

    const dependOnKeyList = computed(() => props.itemConfig?.dependOn ?? [])
    function customHint (CodeMirror, cm, options) {
      const javascriptHint = CodeMirror.hint.javascript
      const result = javascriptHint(cm, options)
      result.list = ['config', 'dependOnValues', 'outDependOnValues', ...dependOnKeyList.value, ...result.list]
      return result
    }
    function customHintOption (CodeMirror) {
      return {
        hint: function hint (...args) {
          return customHint(CodeMirror, ...args)
        },
        completeSingle: false
      }
    }
    return {
      visible,
      getCompleteFun,
      paramsStr,
      customHintOption
    }
  }
})
</script>
