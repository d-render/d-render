<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例 - 选择省份后城市自动加载</span>
    </div>

    <div class="form-demo">
      <el-form :model="model" label-width="100px">
        <el-form-item label="国家">
          <el-select v-model="model.country" placeholder="请选择国家" @change="handleCountryChange">
            <el-option label="中国" value="china" />
            <el-option label="美国" value="usa" />
          </el-select>
        </el-form-item>

        <el-form-item label="省份">
          <el-select
            v-model="model.province"
            :disabled="!model.country"
            :placeholder="model.country ? '请选择省份' : '请先选择国家'"
            @change="handleProvinceChange"
          >
            <el-option
              v-for="item in provinces"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="城市">
          <el-select
            v-model="model.city"
            :disabled="!model.province"
            :placeholder="model.province ? '请选择城市' : '请先选择省份'"
          >
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div class="output-result">
        <div style="font-weight: 600; margin-bottom: 8px;">📝 表单数据</div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>

      <div class="demo-actions">
        <el-button type="primary" size="small" @click="resetForm">重置</el-button>
        <el-button size="small" @click="showCode = !showCode">
          {{ showCode ? '隐藏' : '显示' }}配置代码
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
import CodeBlock from './CodeBlock.vue'

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

const provinces = ref([])
const cities = ref([])

const handleCountryChange = () => {
  model.value.province = ''
  model.value.city = ''
  provinces.value = provinceMap[model.value.country] || []
  cities.value = []
}

const handleProvinceChange = () => {
  model.value.city = ''
  cities.value = cityMap[model.value.province] || []
}

const resetForm = () => {
  model.value = { country: '', province: '', city: '' }
  provinces.value = []
  cities.value = []
}

const cascadeCode = `import { generateFieldList, defineFormFieldConfig } from 'd-render'

const fieldList = generateFieldList(defineFormFieldConfig({
  country: {
    type: 'select',
    label: '国家',
    asyncOptions: fetchCountries
  },
  province: {
    type: 'select',
    label: '省份',
    dependOn: ['country'],
    resetValue: true,  // 国家变化时清空省份
    changeConfig: (config, { country }) => {
      config.disabled = !country  // 未选择国家时禁用
      return config
    },
    asyncOptions: async ({ country }) => {
      if (!country) return []
      return await fetchProvinces(country)
    }
  },
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province'],
    resetValue: true,  // 省份变化时清空城市
    changeConfig: (config, { province }) => {
      config.disabled = !province
      return config
    },
    asyncOptions: async ({ province }) => {
      if (!province) return []
      return await fetchCities(province)
    }
  }
}))`
</script>

<style scoped>
.demo-container {
  margin: 24px 0;
}
</style>
