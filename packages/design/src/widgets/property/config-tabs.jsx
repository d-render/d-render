<template>
  <div class="config-tabs">
    <template v-for="group in groupList" :key="group.name">
      <config-tab :name="group.value" :is-active="group.value === active" @onClick="activeGroup">{{group.label}}</config-tab>
    </template>
  </div>
</template>
<script>
import ConfigTab from './config-tab'
export default {
  components: { ConfigTab },
  props: {
    active: String,
    groupList: Array
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const activeGroup = (name) => {
      emit('update:active', name)
    }
    return {
      activeGroup
    }
  }
}
</script>
