import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

export const useTpl = (fieldKey) => {
  const tplList = ref([])
  const initTpl = () => {
    const data = localStorage.getItem(fieldKey)
    if (data) {
      tplList.value = data
        ? JSON.parse(data)
        : []
    }
  }
  const saveTpl = (source) => {
    ElMessageBox.prompt('模版名称', '保存模版', {
      inputValidator: val => !!val.trim(),
      inputPlaceholder: '请输入模版名称',
      inputErrorMessage: '请输入模版名称'
    }).then(val => {
      tplList.value.push({ name: val, source })
      localStorage.setItem(fieldKey, JSON.stringify(tplList.value))
    })
  }

  return {
    tplList,
    initTpl,
    saveTpl
  }
}
