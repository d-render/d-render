<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例 — 类型联动显隐；省份变更会清空并刷新城市选项</span>
    </div>

    <div class="form-demo">
      <DrForm
        ref="formRef"
        v-model:model="model"
        :field-list="fieldList"
        label-width="100px"
        :grid="1"
      />

      <div class="output-result">
        <div style="font-weight: 600; margin-bottom: 8px;">表单数据 (model)</div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>

      <div class="demo-actions">
        <el-button type="primary" size="small" @click="resetForm">重置表单</el-button>
        <el-button size="small" @click="showCode = !showCode">
          {{ showCode ? '隐藏' : '显示' }}配置说明
        </el-button>
      </div>

      <div v-if="showCode" class="code-block-wrapper" style="margin-top: 16px">
        <CodeBlock :code="dependonCode" language="javascript" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DrForm, generateFieldList, defineFormFieldConfig } from 'd-render'
import { ensureDocDRender } from './ensure-doc-d-render'
import CodeBlock from './CodeBlock.vue'

ensureDocDRender()

const formRef = ref()
const showCode = ref(false)

const provinces = [
  { value: 1, label: '北京' },
  { value: 2, label: '上海' },
  { value: 3, label: '广东' }
]

const cityMap = {
  1: [
    { value: 101, label: '朝阳区' },
    { value: 102, label: '海淀区' }
  ],
  2: [
    { value: 201, label: '浦东新区' },
    { value: 202, label: '黄浦区' }
  ],
  3: [
    { value: 301, label: '广州市' },
    { value: 302, label: '深圳市' }
  ]
}

const fetchProvinces = async () => {
  await new Promise((r) => setTimeout(r, 120))
  return provinces
}

const model = ref({
  type: 'personal',
  companyName: '',
  province: '',
  city: ''
})

const fieldList = generateFieldList(defineFormFieldConfig({
  type: {
    type: 'select',
    label: '类型',
    options: [
      { value: 'personal', label: '个人' },
      { value: 'company', label: '企业' }
    ]
  },
  companyName: {
    type: 'input',
    label: '企业名称',
    required: true,
    placeholder: '请输入企业名称',
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      config.hideItem = type !== 'company'
      return config
    }
  },
  province: {
    type: 'select',
    label: '省份',
    placeholder: '请选择省份',
    asyncOptions: fetchProvinces
  },
  city: {
    type: 'select',
    label: '城市',
    placeholder: '请选择城市',
    dependOn: ['province'],
    resetValue: true,
    changeConfig: (config, { province }) => {
      config.disabled = !province
      config.placeholder = province ? '请选择城市' : '请先选择省份'
      return config
    },
    asyncOptions: async (dependOnValues) => {
      const province = dependOnValues?.province
      if (!province) return []
      await new Promise((r) => setTimeout(r, 80))
      return cityMap[province] || []
    }
  }
}))

const resetForm = () => {
  formRef.value?.clearValidate?.()
  model.value = {
    type: 'personal',
    companyName: '',
    province: '',
    city: ''
  }
}

const dependonCode = `// dependOn + changeConfig：企业名称仅在企业类型时展示
companyName: {
  type: 'input',
  label: '企业名称',
  dependOn: ['type'],
  changeConfig: (config, { type }) => {
    config.hideItem = type !== 'company'
    return config
  }
}

// dependOn + resetValue + asyncOptions：省变化时清空市并拉取选项
city: {
  type: 'select',
  label: '城市',
  dependOn: ['province'],
  resetValue: true,
  changeConfig: (config, { province }) => {
    config.disabled = !province
    return config
  },
  asyncOptions: async (dependOnValues) => {
    if (!dependOnValues?.province) return []
    return await fetchCities(dependOnValues.province)
  }
}`
</script>

<style scoped>
.demo-container {
  margin: 24px 0;
}
</style>
