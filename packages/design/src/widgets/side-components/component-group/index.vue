<template>
  <el-scrollbar>
    <template v-for="group in groupList" :key="group.groupName">
      <form-component-group :group="group" @add="add"></form-component-group>
    </template>
  </el-scrollbar>
</template>
<script>
import { ElScrollbar } from 'element-plus'
import FormComponentGroup from './group'
export default {
  name: 'FormComponents',
  components: { FormComponentGroup, ElScrollbar },
  props: {
    groupList: Array
  },
  setup (props, { emit }) {
    const add = (row) => {
      emit('add', row)
    }
    return { add }
  }
}
</script>
