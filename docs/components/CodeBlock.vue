<template>
  <div class="code-block">
    <div class="code-header">
      <span class="language-badge">{{ language }}</span>
      <el-button
        v-if="showCopy"
        type="primary"
        link
        size="small"
        @click="copyCode"
      >
        <svg v-if="!copied" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        {{ copied ? '已复制' : '复制代码' }}
      </el-button>
    </div>
    <pre><code :class="`language-${language}`">{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  showCopy: {
    type: Boolean,
    default: true
  }
})

const copied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.code-block {
  position: relative;
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-code-block-bg);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.language-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.6;
}

.code-block code {
  font-family: var(--vp-font-family-mono);
}
</style>
