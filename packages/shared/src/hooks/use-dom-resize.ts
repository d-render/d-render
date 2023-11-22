import { onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
const _ResizeObserver = window.ResizeObserver

class OResizeObserver extends _ResizeObserver {
  constructor (cb: (entries: ResizeObserverEntry[], observe: ResizeObserver)=> void) {
    super((entries, observe) => {
      window.requestAnimationFrame(() => {
        cb(entries, observe)
      })
    })
  }
}
window.ResizeObserver = OResizeObserver

export const useObserveDomResize = (container: () => HTMLElement|HTMLElement[], cb: (entry: ResizeObserverEntry)=> void) => {
  onMounted(() => {
    const domList = ([] as HTMLElement[]).concat(container()) // 同时支持数组及单个容器
    const cbList = ([] as Array<(entry: ResizeObserverEntry)=>void>).concat(cb)
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
