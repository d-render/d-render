<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例 - 选择省份后，城市会自动加载</span>
    </div>

    <div class="form-demo">
      <el-form :model="model" label-width="100px">
        <el-form-item label="类型">
          <el-radio-group v-model="model.type">
            <el-radio value="personal">个人</el-radio>
            <el-radio value="company">企业</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="model.type === 'company'" label="企业名称" required>
          <el-input v-model="model.companyName" placeholder="请输入企业名称" />
        </el-form-item>

        <el-divider content-position="left">级联选择</el-divider>

        <el-form-item label="省份">
          <el-select
            v-model="model.province"
            placeholder="请选择省份"
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
        <div style="font-weight: 600; margin-bottom: 8px;">📝 表单数据 (model)</div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>

      <div class="demo-actions">
        <el-button type="primary" size="small" @click="resetForm">重置表单</el-button>
        <el-button size="small" @click="showCode = !showCode">
          {{ showCode ? '隐藏' : '显示' }}配置代码
        </el-button>
      </div>

      <div v-if="showCode" class="code-block-wrapper" style="margin-top: 16px">
        <CodeBlock :code="dependonCode" language="javascript" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CodeBlock from './CodeBlock.vue'

const model = ref({
  type: 'personal',
  companyName: '',
  province: '',
  city: ''
})

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

const cities = ref([])

const handleProvinceChange = (val) => {
  model.value.city = ''
  cities.value = cityMap[val] || []
}

const resetForm = () => {
  model.value = {
    type: 'personal',
    companyName: '',
    province: '',
    city: ''
  }
  cities.value = []
}

const dependonCode = `// 显示/隐藏联动
{
  type: {
    type: 'radio',
    label: '类型',
    options: [
      { value: 'personal', label: '个人' },
      { value: 'company', label: '企业' }
    ]
  },
  companyName: {
    type: 'input',
    label: '企业名称',
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      config.hideItem = type !== 'company'
      return config
    }
  }
}

// 级联选择
{
  province: {
    type: 'select',
    label: '省份',
    asyncOptions: fetchProvinces
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
}`
</script>

<style scoped>
.demo-container {
  margin: 24px 0;
}
</style>
