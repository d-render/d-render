<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例 - 搜索条件实时展示</span>
    </div>

    <div class="search-form-demo">
      <el-form :model="model" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="model.keyword"
            placeholder="请输入关键词"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="model.status" placeholder="全部" clearable @change="handleSearch">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="model.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="output-result">
        <div style="font-weight: 600; margin-bottom: 8px;">
          🔍 搜索条件
          <el-tag v-if="searchCount > 0" size="small" type="success" style="margin-left: 8px">
            已搜索 {{ searchCount }} 次
          </el-tag>
        </div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>

      <div class="demo-actions">
        <el-button size="small" @click="showCode = !showCode">
          {{ showCode ? '隐藏' : '显示' }}配置代码
        </el-button>
      </div>

      <div v-if="showCode" class="code-block-wrapper" style="margin-top: 16px">
        <CodeBlock :code="configCode" language="javascript" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeBlock from './CodeBlock.vue'

const model = ref({
  keyword: '',
  status: null,
  dateRange: null
})

const searchCount = ref(0)
const showCode = ref(false)

const handleSearch = () => {
  searchCount.value++
  console.log('搜索条件:', model.value)
}

const handleReset = () => {
  model.value = {
    keyword: '',
    status: null,
    dateRange: null
  }
}

const configCode = `import { generateFieldList, defineSearchFieldConfig } from 'd-render'

const fieldList = generateFieldList(defineSearchFieldConfig({
  keyword: {
    type: 'input',
    label: '关键词',
    placeholder: '请输入关键词'
  },
  status: {
    type: 'select',
    label: '状态',
    immediateSearch: true,  // 变更时立即搜索
    options: [
      { value: '', label: '全部' },
      { value: 1, label: '启用' },
      { value: 0, label: '禁用' }
    ]
  },
  dateRange: {
    type: 'dateRange',
    label: '创建时间',
    otherKey: 'createEndTime'  // 结束日期
  }
}))`
</script>

<style scoped>
.search-form-demo {
  background: var(--vp-c-bg-soft);
  padding: 20px;
  border-radius: 8px;
}
</style>
