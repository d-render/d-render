import { onMounted, onUnmounted } from 'vue'

export const useObserveDomResize = (container, cb) => {
  onMounted(() => {
    const domList = [].concat(container()) // 同时支持数组及单个容器
    const cbList = [].concat(cb)
    const resizeObserver = new ResizeObserver((entries)=> requestAnimationFrame(() => {
      entries.forEach((entry, i) => {
        const cb = cbList[i]
        if (cb && typeof cb === 'function') {
          cb(entry)
        }
      })
    }))
    // 开启监听
    domList.forEach((dom) => {
      resizeObserver.observe(dom)
    })
    onUnmounted(() => {
      // 销毁
      resizeObserver.disconnect()
    })
  })
}
