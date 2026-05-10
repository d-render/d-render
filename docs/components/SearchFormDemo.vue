<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例（DrSearchForm）— 条件变更与搜索会反映在下方 model</span>
    </div>

    <div class="search-form-demo">
      <DrSearchForm
        v-model:model="model"
        :field-list="fieldList"
        :collapse="false"
        :search-reset="true"
        label-width="88px"
        @search="handleSearch"
      />

      <div class="output-result">
        <div style="font-weight: 600; margin-bottom: 8px;">
          搜索条件 (model)
          <el-tag v-if="searchCount > 0" size="small" type="success" style="margin-left: 8px">
            已触发搜索 {{ searchCount }} 次
          </el-tag>
        </div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>

      <div class="demo-actions">
        <el-button size="small" @click="showCode = !showCode">
          {{ showCode ? '隐藏' : '显示' }}配置说明
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
import { DrSearchForm, generateFieldList, defineSearchFieldConfig } from 'd-render'
import { ensureDocDRender } from './ensure-doc-d-render'
import CodeBlock from './CodeBlock.vue'

ensureDocDRender()

const model = ref({
  keyword: '',
  status: null,
  createTime: null,
  createEndTime: null
})

const searchCount = ref(0)
const showCode = ref(false)

const fieldList = generateFieldList(defineSearchFieldConfig({
  keyword: {
    type: 'input',
    label: '关键词',
    placeholder: '请输入关键词'
  },
  status: {
    type: 'select',
    label: '状态',
    immediateSearch: true,
    options: [
      { value: 1, label: '启用' },
      { value: 0, label: '禁用' }
    ]
  },
  createTime: {
    type: 'date',
    label: '创建时间',
    inputType: 'daterange',
    rangeSeparator: '至',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    valueFormat: 'YYYY-MM-DD',
    otherKey: 'createEndTime'
  }
}))

const handleSearch = () => {
  searchCount.value++
}

const configCode = `// 标准插件中日期范围使用 type: 'date' + inputType: 'daterange'，配合 otherKey 写入结束时间
createTime: {
  type: 'date',
  label: '创建时间',
  inputType: 'daterange',
  valueFormat: 'YYYY-MM-DD',
  otherKey: 'createEndTime'
}

// immediateSearch：变更即触发 @search
status: {
  type: 'select',
  label: '状态',
  immediateSearch: true,
  options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }]
}`
</script>

<style scoped>
.search-form-demo {
  background: var(--vp-c-bg-soft);
  padding: 20px;
  border-radius: 8px;
}
</style>
