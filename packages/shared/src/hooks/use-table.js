import { inject } from 'vue'
export const cipTableKey = Symbol('cip-table')
export const useTable = () => {
  return inject(cipTableKey, {})
}

// TODO: 此处需要处理cip-table-handler cip-table-button部分的配置问题
