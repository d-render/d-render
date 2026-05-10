<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例（DrTable）— 「行编辑」请点击表格行进入编辑；「全表编辑」可直接改单元格</span>
    </div>

    <div class="table-demo">
      <div style="margin-bottom: 16px">
        <el-radio-group v-model="editType">
          <el-radio-button label="row">行编辑</el-radio-button>
          <el-radio-button label="all">全表编辑</el-radio-button>
        </el-radio-group>
        <el-button type="primary" style="margin-left: 16px" @click="addRow">
          添加行
        </el-button>
      </div>

      <DrTable
        v-model:data="tableData"
        :columns="columns"
        :edit-type="editType"
        border
        row-key="__rowId"
      />

      <div class="output-result" style="margin-top: 16px">
        <div style="font-weight: 600; margin-bottom: 8px;">表格数据 (data)</div>
        <pre>{{ JSON.stringify(tableData, null, 2) }}</pre>
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
import { DrTable, generateFieldList, defineTableFieldConfig } from 'd-render'
import { ensureDocDRender } from './ensure-doc-d-render'
import CodeBlock from './CodeBlock.vue'

ensureDocDRender()

let rowId = 0
const nextRowId = () => `r-${++rowId}`

const editType = ref('row')
const showCode = ref(false)

const tableData = ref([
  { __rowId: nextRowId(), name: '张三', age: 25, sex: 1 },
  { __rowId: nextRowId(), name: '李四', age: 30, sex: 2 }
])

const columns = generateFieldList(defineTableFieldConfig({
  name: {
    type: 'input',
    label: '姓名',
    writable: true
  },
  age: {
    type: 'number',
    label: '年龄',
    writable: true,
    min: 0,
    max: 150
  },
  sex: {
    type: 'select',
    label: '性别',
    writable: true,
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  }
}))

const addRow = () => {
  tableData.value = [
    ...tableData.value,
    { __rowId: nextRowId(), name: '', age: null, sex: null }
  ]
}

const configCode = `import { DrTable, generateFieldList, defineTableFieldConfig } from 'd-render'

const columns = generateFieldList(defineTableFieldConfig({
  name: { type: 'input', label: '姓名', writable: true },
  age: { type: 'number', label: '年龄', writable: true },
  sex: {
    type: 'select',
    label: '性别',
    writable: true,
    options: [{ value: 1, label: '男' }, { value: 2, label: '女' }]
  }
}))

// editType: 'row' | 'all' | 'cell' — 行编辑时需点击行进入编辑态
<DrTable v-model:data="tableData" :columns="columns" :edit-type="editType" row-key="id" />`
</script>

<style scoped>
.table-demo {
  overflow-x: auto;
}
</style>
