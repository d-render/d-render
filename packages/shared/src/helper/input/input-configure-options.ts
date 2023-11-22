import { IFormFieldConfig } from '../../utils'
export const configureOptionsFieldConfigMap: IFormFieldConfig<Record<string, unknown>> = {
  key: {
    type: 'input',
    label: '字段标识',
    limit: 50,
    description: '修改本项将导致数据依赖失效，需要重新进行配置'
  },
  otherKey: {
    type: 'input',
    label: '其他字段标识',
    limit: 50,
    description: '修改本项将导致数据依赖失效，需要重新进行配置'
  },
  label: {
    type: 'input',
    label: '标题',
    limit: 20
  },
  span: {
    type: 'number',
    label: '占列数',
    min: 1,
    max: 24
  },
  labelPosition: {
    type: 'radio',
    label: '标签对齐方式',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '右对齐', value: 'right' },
      { label: '顶部对齐', value: 'top' }
    ],
    isButton: true,
    defaultValue: 'right'
  },
  isMainField: {
    type: 'switch',
    label: '是否为主要字段',
    description: '该项设置用于表单作为一个组件被引入时列表的主要信息'
  },
  description: {
    type: 'textarea',
    label: '字段说明',
    limit: 200
  },
  hideLabel: {
    type: 'switch',
    label: '是否隐藏标题'
  },
  hideItem: {
    type: 'switch',
    label: '是否隐藏此项'
  },
  width: {
    type: 'input',
    label: '宽度',
    defaultValue: '100%',
    limit: 10
  },
  labelWidth: { // 配置由插槽实现
    type: 'number',
    label: '标签宽度',
    step: 10
  },
  placeholder: {
    type: 'input',
    label: '占位内容',
    limit: 200
  },
  defaultValue: {
    type: 'input',
    label: '默认值'
  },
  limit: {
    type: 'number',
    label: '长度限制',
    min: 0
  },
  required: {
    label: '校验',
    type: 'singleCheckbox',
    option: { value: true, label: '必填' }
  },
  requiredErrorMessage: {
    label: '',
    type: 'input',
    placeholder: '自定义错误提示',
    dependOn: ['required'],
    readable: false,
    changeConfig: (config, { required }) => {
      if (required) config.writable = true
      return config
    },
    limit: 20
  },
  validateValue: {},
  validateValueErrorMessage: {
    label: '',
    type: 'input',
    placeholder: '自定义错误提示',
    dependOn: ['validateValue'],
    readable: false,
    changeConfig: (config, { validateValue }) => {
      if (validateValue) config.writable = true
      return config
    },
    limit: 20
  },
  regexpValidate: {},
  regexpValidateErrorMessage: {
    label: '',
    type: 'input',
    placeholder: '自定义错误提示',
    dependOn: ['regexpValidate'],
    readable: false,
    changeConfig: (config, { regexpValidate }) => {
      if (regexpValidate) config.writable = true
      return config
    },
    limit: 20
  },
  dependOn: {
    type: 'input',
    label: '数据依赖',
    description: '修改字段标识或其他字段标识将导致本项配置失效，需要重新进行配置'
  },
  changeValueType: {
    type: 'radio',
    label: '依赖数据值变动回调函数-修改值',
    description: '修改字段标识或其他字段标识将导致本项配置失效，需要重新进行配置',
    defaultValue: 'writing',
    options: [
      { value: 'writing', label: '手写' },
      { value: 'config', label: '配置' }
    ]
  },
  changeValueStr: {
    type: 'input',
    label: '',
    dependOn: ['changeValueType'],
    changeConfig: (config, { changeValueType }) => {
      config.readable = changeValueType === 'writing'
      return config
    }
  },
  valueChangeConfig: {
    dependOn: ['changeValueType'],
    changeConfig: (config, { changeValueType }) => {
      config.readable = changeValueType === 'config'
      return config
    }
  },
  changeConfigType: {
    type: 'radio',
    label: '依赖数据值变动回调函数-修改表单配置',
    description: '修改字段标识或其他字段标识将导致本项配置失效，需要重新进行配置',
    defaultValue: 'writing',
    options: [
      { value: 'writing', label: '手写' },
      { value: 'config', label: '配置' }
    ]
  },
  changeConfigStr: {
    type: 'input',
    label: '',
    dependOn: ['changeConfigType'],
    changeConfig: (config, { changeConfigType }) => {
      config.readable = changeConfigType === 'writing'
      return config
    }
  },
  configChangeConfig: {
    dependOn: ['changeConfigType'],
    changeConfig: (config, { changeConfigType }) => {
      config.readable = changeConfigType === 'config'
      return config
    }
  }
}

export const basicInputConfigureOptions = () => {
  return {
    key: {},
    label: {},
    // labelPosition: {}, //暂不开启组件自定义label对其方式
    description: {},
    hideLabel: {},
    hideItem: {},
    width: {},
    labelWidth: {},
    dependOn: {},
    changeValueType: {},
    changeValueStr: {},
    valueChangeConfig: {},
    changeConfigType: {},
    changeConfigStr: {},
    configChangeConfig: {}
  }
}

export const basicTwoInputConfigureOptions = () => {
  return {
    key: {},
    otherKey: {},
    label: {},
    description: {},
    isMainField: {},
    hideLabel: {},
    hideItem: {},
    width: {},
    labelWidth: {},
    dependOn: {},
    changeValueType: {},
    changeValueStr: {},
    valueChangeConfig: {},
    changeConfigType: {},
    changeConfigStr: {},
    configChangeConfig: {}
  }
}

// input文件夹内无configure.js的配置文件使用此默认options
export const defaultConfigureOptions = () => ({
  ...basicInputConfigureOptions(),
  required: {},
  requiredErrorMessage: {},
  validateValue: {},
  validateValueErrorMessage: {},
  regexpValidate: {},
  regexpValidateErrorMessage: {}
})
