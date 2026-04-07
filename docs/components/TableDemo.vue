<template>
  <div class="demo-container">
    <div class="interactive-hint">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3v2h4.59L12 10.59 13.41 12 19 6.41V11h2V3h-8zM5 13h2v6h6v2H5v-8z"/>
      </svg>
      <span>交互式示例 - 表格支持行编辑和全表编辑</span>
    </div>

    <div class="table-demo">
      <div style="margin-bottom: 16px">
        <el-radio-group v-model="editType">
          <el-radio-button value="row">行编辑</el-radio-button>
          <el-radio-button value="all">全表编辑</el-radio-button>
        </el-radio-group>
        <el-button type="primary" style="margin-left: 16px" @click="addRow">
          添加行
        </el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180">
          <template #default="{ row }">
            <el-input
              v-if="isEditable(row)"
              v-model="row.name"
              placeholder="请输入姓名"
            />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="age" label="年龄" width="120">
          <template #default="{ row }">
            <el-input-number
              v-if="isEditable(row)"
              v-model="row.age"
              :min="0"
              :max="150"
              controls-position="right"
            />
            <span v-else>{{ row.age }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sex" label="性别" width="140">
          <template #default="{ row }">
            <el-select v-if="isEditable(row)" v-model="row.sex" placeholder="请选择">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
            <span v-else>{{ row.sex === 1 ? '男' : row.sex === 2 ? '女' : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" v-if="editType === 'row'">
          <template #default="{ row, $index }">
            <el-button
              v-if="!editingIndex"
              type="primary"
              link
              size="small"
              @click="startEdit($index)"
            >
              编辑
            </el-button>
            <template v-else-if="editingIndex === $index">
              <el-button type="primary" link size="small" @click="saveEdit">
                保存
              </el-button>
              <el-button link size="small" @click="cancelEdit">
                取消
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="output-result" style="margin-top: 16px">
        <div style="font-weight: 600; margin-bottom: 8px;">📊 表格数据 (data)</div>
        <pre>{{ JSON.stringify(tableData, null, 2) }}</pre>
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

const editType = ref('row')
const editingIndex = ref(null)
const showCode = ref(false)

const tableData = ref([
  { name: '张三', age: 25, sex: 1 },
  { name: '李四', age: 30, sex: 2 }
])

const isEditable = (row) => {
  return editType.value === 'all' || editingIndex.value === tableData.value.indexOf(row)
}

const startEdit = (index) => {
  editingIndex.value = index
}

const saveEdit = () => {
  editingIndex.value = null
}

const cancelEdit = () => {
  editingIndex.value = null
}

const addRow = () => {
  tableData.value.push({
    name: '',
    age: null,
    sex: null
  })
  if (editType.value === 'row') {
    editingIndex.value = tableData.value.length - 1
  }
}

const configCode = `import { generateFieldList } from 'd-render'

const columns = generateFieldList({
  name: {
    type: 'input',
    label: '姓名',
    writable: true  // 可编辑
  },
  age: {
    type: 'number',
    label: '年龄',
    writable: true
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
})

// 使用
<DrTable
  v-model:data="tableData"
  :columns="columns"
  :editType="editType"  // 'row' | 'all'
/>`
</script>

<style scoped>
.table-demo {
  overflow-x: auto;
}
</style>
