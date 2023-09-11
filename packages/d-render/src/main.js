import pkg from '../package.json'
export const version = pkg.version
export { default as CipForm, default as DrForm } from './cip-form'
export { default as CipFormItem, default as DrFormItem } from './cip-form-item'
export { default as CipFormLayout, default as DrFormLayout } from './cip-form-layout'
export { default as CipSearchForm, default as DrSearchForm } from './cip-search-form'
export { default as CipTable, default as DrTable } from './cip-table'
export { default as CipFormRender, default as DrFormRender } from './cip-form-render'
export { default as CipFormInputTransform, default as DrFormInputTransform } from './cip-form-input-transform'
export { default as CipTableRender, default as DrTableRender } from './cip-table-render'
export {
  DRender,
  settingValueTransformState,
  generateFieldList,
  insertFieldConfigToList,
  keysToConfigMap,
  defineSearchFieldConfig,
  defineFormFieldConfig,
  defineTableFieldConfig
} from '@d-render/shared'
