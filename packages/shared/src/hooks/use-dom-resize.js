import { onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
class OResizeObserver extends window.ResizeObserver {
  constructor (cb) {
    super((entries, observe) => {
      window.requestAnimationFrame(() => {
        cb(entries, observe)
      })
    })
  }
}
export const useObserveDomResize = (container, cb) => {
  onMounted(() => {
    const domList = [].concat(container()) // 同时支持数组及单个容器
    const cbList = [].concat(cb)
    const resizeObserver = new OResizeObserver((entries) => {
      entries.forEach((entry, i) => {
        const cb = cbList[i]
        if (cb && typeof cb === 'function') {
          cb(entry)
        }
      })
    })
    // 开启监听
    domList.forEach((dom) => {
      resizeObserver.observe(dom)
    })
    onActivated(() => {
      domList.forEach((dom) => {
        resizeObserver.observe(dom)
      })
    })
    onDeactivated(() => {
      console.log('unobserve')
      domList.forEach((dom) => {
        resizeObserver.unobserve(dom)
      })
    })

    onUnmounted(() => {
      // 销毁
      resizeObserver.disconnect()
    })
  })
}
