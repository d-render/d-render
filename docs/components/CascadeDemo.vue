<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例 — 国家 / 省 / 市三级联动（dependOn + asyncOptions）</span>
    </div>

    <div class="form-demo">
      <DrForm
        v-model:model="model"
        :field-list="fieldList"
        label-width="100px"
        :grid="1"
      />

      <div class="output-result">
        <div style="font-weight: 600; margin-bottom: 8px;">表单数据</div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>

      <div class="demo-actions">
        <el-button type="primary" size="small" @click="resetForm">重置</el-button>
        <el-button size="small" @click="showCode = !showCode">
          {{ showCode ? '隐藏' : '显示' }}配置说明
        </el-button>
      </div>

      <div v-if="showCode" class="code-block-wrapper" style="margin-top: 16px">
        <CodeBlock :code="cascadeCode" language="javascript" />
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

const model = ref({
  country: '',
  province: '',
  city: ''
})

const showCode = ref(false)

const provinceMap = {
  china: [
    { value: 1, label: '北京' },
    { value: 2, label: '上海' },
    { value: 3, label: '广东' }
  ],
  usa: [
    { value: 11, label: '加利福尼亚' },
    { value: 12, label: '纽约' }
  ]
}

const cityMap = {
  1: [{ value: 101, label: '朝阳区' }, { value: 102, label: '海淀区' }],
  2: [{ value: 201, label: '浦东新区' }, { value: 202, label: '黄浦区' }],
  3: [{ value: 301, label: '广州市' }, { value: 302, label: '深圳市' }],
  11: [{ value: 1101, label: '洛杉矶' }, { value: 1102, label: '旧金山' }],
  12: [{ value: 1201, label: '纽约市' }]
}

const fetchCountries = async () => {
  await new Promise((r) => setTimeout(r, 100))
  return [
    { value: 'china', label: '中国' },
    { value: 'usa', label: '美国' }
  ]
}

const fieldList = generateFieldList(defineFormFieldConfig({
  country: {
    type: 'select',
    label: '国家',
    placeholder: '请选择国家',
    asyncOptions: fetchCountries
  },
  province: {
    type: 'select',
    label: '省份',
    placeholder: '请选择省份',
    dependOn: ['country'],
    resetValue: true,
    changeConfig: (config, { country }) => {
      config.disabled = !country
      config.placeholder = country ? '请选择省份' : '请先选择国家'
      return config
    },
    asyncOptions: async (dependOnValues) => {
      const country = dependOnValues?.country
      if (!country) return []
      await new Promise((r) => setTimeout(r, 100))
      return provinceMap[country] || []
    }
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
  model.value = { country: '', province: '', city: '' }
}

const cascadeCode = `// 国家 -> 省 -> 市：每一级 dependOn 上一级，resetValue 在依赖变化时清空本级
province: {
  type: 'select',
  label: '省份',
  dependOn: ['country'],
  resetValue: true,
  changeConfig: (config, { country }) => {
    config.disabled = !country
    return config
  },
  asyncOptions: async (dependOnValues) => {
    if (!dependOnValues?.country) return []
    return await fetchProvinces(dependOnValues.country)
  }
}`
</script>

<style scoped>
.demo-container {
  margin: 24px 0;
}
</style>
