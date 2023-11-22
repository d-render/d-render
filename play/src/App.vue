<template>
  <CipConfigProvide :file-upload="fileUpload">
    <PlConfigProvide :theme="theme" :themes="themes">
      <router-view/>
    </PlConfigProvide>
  </CipConfigProvide>
</template>
<script setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PlConfigProvide } from '@cip/page-layout'
import CipConfigProvide from '@cip/components/cip-config-provide'
import ThemeStandard from '@page-layout/theme-standard'
import '@page-layout/theme-standard/dist/index.css'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const theme = 'supergravity'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const themes = {
  supergravity: ThemeStandard
}
const fileUpload = async (e) => {
  await setTimeout(() => {
    console.log(e, 'e')
  }, 1000)
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  color: var(--el-text-color-primary);
}
</style>
