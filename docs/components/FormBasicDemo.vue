<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例（DrForm + @d-render/plugin-standard）— 可修改表单值</span>
    </div>

    <div class="form-demo">
      <DrForm
        v-model:model="model"
        :field-list="fieldList"
        label-width="100px"
        :grid="1"
      />

      <div class="output-result">
        <div style="font-weight: 600; margin-bottom: 8px;">表单数据 (model)</div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>
    </div>

    <div class="code-block-wrapper">
      <CodeBlock :code="configCode" language="javascript" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DrForm, generateFieldList, defineFormFieldConfig } from 'd-render'
import { ensureDocDRender } from './ensure-doc-d-render'
import CodeBlock from './CodeBlock.vue'

ensureDocDRender()

const model = ref({
  name: '',
  age: null,
  sex: null,
  city: ''
})

const fieldList = generateFieldList(defineFormFieldConfig({
  name: {
    type: 'default',
    label: '姓名',
    required: true,
    placeholder: '请输入姓名'
  },
  age: {
    type: 'number',
    label: '年龄',
    min: 0,
    max: 150
  },
  sex: {
    type: 'radio',
    label: '性别',
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  },
  city: {
    type: 'select',
    label: '城市',
    placeholder: '请选择城市',
    options: [
      { value: 'beijing', label: '北京' },
      { value: 'shanghai', label: '上海' },
      { value: 'guangzhou', label: '广州' },
      { value: 'shenzhen', label: '深圳' }
    ]
  }
}))

const configCode = `import { DrForm, generateFieldList, defineFormFieldConfig } from 'd-render'
// 应用入口需注册：new DRender().setConfig({ plugins: [PluginStandard] })

const fieldList = generateFieldList(defineFormFieldConfig({
  name: { type: 'input', label: '姓名', required: true },
  age: { type: 'number', label: '年龄', min: 0, max: 150 },
  sex: {
    type: 'radio',
    label: '性别',
    options: [{ value: 1, label: '男' }, { value: 2, label: '女' }]
  },
  city: {
    type: 'select',
    label: '城市',
    options: [
      { value: 'beijing', label: '北京' },
      { value: 'shanghai', label: '上海' }
    ]
  }
}))`
</script>

<style scoped>
.demo-container {
  margin: 24px 0;
}
</style>
