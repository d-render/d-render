import { generateFieldList, defineFormFieldConfig, defineTableFieldConfig } from 'd-render'

const tableCommonConfig = {
  prop: { label: '名称' },
  type: {
    label: '类型',
    width: '120px',
    dependOn: ['isLink'],
    dynamic: true,
    changeConfig: (config, { isLink }) => {
      config.type = isLink ? 'link' : 'default'
      config.otherKey = 'text'
      return config
    }
  },
  params: { label: '参数' },
  default: { label: '默认值' },
  description: { label: '说明' }
}
const attrTitleStyle = {
  inputStyle: { margin: '20px 0' },
  fontSize: '22'
}
export const infoFieldList = generateFieldList(defineFormFieldConfig({
  subTitle: {
    type: 'text',
    border: false
  },
  propsTitle: {
    ...attrTitleStyle,
    type: 'staticInfo',
    staticInfo: 'Props',
    border: false
  },
  props: {
    type: 'table',
    border: false,
    hideIndex: true,
    options: generateFieldList(defineTableFieldConfig({
      prop: { width: '200px' },
      type: { width: '200px' },
      default: { width: '90px' },
      description: { }
    }), tableCommonConfig)
  },
  eventsTitle: {
    type: 'staticInfo',
    ...attrTitleStyle,
    staticInfo: 'Events',
    readable: false,
    dependOn: ['events'],
    changeConfig: (config, { events }) => {
      config.readable = events?.length > 0
      return config
    }
  },
  events: {
    type: 'table',
    border: false,
    hideIndex: true,
    hideOnEmpty: true,
    options: generateFieldList(defineTableFieldConfig({
      prop: { width: '200px' },
      params: { width: '200px' },
      description: { }
    }), tableCommonConfig)
  },
  exposesTitle: {
    type: 'staticInfo',
    ...attrTitleStyle,
    staticInfo: 'Exposes',
    readable: false,
    dependOn: ['exposes'],
    changeConfig: (config, { exposes }) => {
      config.readable = exposes?.length > 0
      return config
    }
  },
  exposes: {
    type: 'table',
    border: false,
    hideIndex: true,
    hideOnEmpty: true,
    options: generateFieldList(defineTableFieldConfig({
      prop: { width: '200px' },
      type: { width: '200px' },
      description: { }
    }), tableCommonConfig)
  }
}))
