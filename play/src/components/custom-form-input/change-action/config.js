import {
  generateFieldList,
  defineFormFieldConfig,
  defineTableFieldConfig
} from 'd-render'
import { getComponentConfigure } from '@d-render/design/esm/plugins/field-configure/config'
import { configureOptionsFieldConfigMap } from '@d-render/shared'

export const START_NODE_ID = '_flow-start'
export const END_NODE_ID = '_flow-end'

export const defaultData = {
  nodes: [
    {
      id: START_NODE_ID,
      nodeType: 'start',
      x: 100,
      y: 40,
      width: 80,
      height: 40,
      label: '开始',
      attrs: {
        body: {
          rx: 20,
          ry: 26
        }
      }
    },
    {
      id: END_NODE_ID,
      nodeType: 'end',
      x: 100,
      y: 160,
      width: 80,
      height: 40,
      label: '结束',
      attrs: {
        body: {
          rx: 20,
          ry: 26
        }
      }
    }
  ],
  edges: [
    {
      source: START_NODE_ID,
      target: END_NODE_ID
    }
  ]
}

export const edgeMarkupConfig = [
  {
    tagName: 'circle',
    selector: 'button',
    attrs: {
      r: 10,
      stroke: '#409eff',
      strokeWidth: 2,
      fill: 'white',
      cursor: 'pointer'
    }
  },
  {
    tagName: 'text',
    textContent: '+',
    selector: 'icon',
    attrs: {
      fill: '#409eff',
      fontSize: 18,
      textAnchor: 'middle',
      pointerEvents: 'none',
      y: '0.3em'
    }
  }
]

export const nodeList = [
  {
    groupName: '组件',
    nodes: [
      // {
      //   type: 'var',
      //   label: '设置变量'
      // },
      {
        type: 'config',
        label: '修改配置'
      }
    ]
  }
  // {
  //   groupName: '服务',
  //   nodes: [
  //     {
  //       type: 'request',
  //       label: '发送请求'
  //     }
  //   ]
  // }
]

const advancedConfigMap = defineFormFieldConfig({
  // _ttt: {
  //   type: 'staticInfo',
  //   staticInfo: '条件设置',
  //   configSort: 0.1
  // },
  execute: {
    label: '执行条件',
    type: 'expression',
    configSort: 0
  }
  // intercept: {
  //   label: '阻断条件',
  //   type: 'expression'
  // }
})

export const varConfigList = generateFieldList(defineFormFieldConfig({
  ...advancedConfigMap,
  target: {
    type: 'select',
    label: '目标组件',
    dependOn: ['schema'],
    options: [],
    asyncOptions: ({ schema }) => {
      return schema.list.map(item => ({
        value: item.key,
        label: `${item.config.label} (${item.key})`
      }))
    }
  },
  valueType: {
    type: 'radio',
    label: '值类型',
    defaultValue: 'static',
    options: [
      { value: 'static', label: '静态值' },
      { value: 'expression', label: '表达式' }
    ]
  },
  value: {
    label: '静态值',
    dependOn: ['valueType'],
    changeConfig: (config, { valueType }) => {
      config.writable = valueType === 'static'
      return config
    }
  },
  expression: {
    label: '表达式',
    type: 'expression',
    dependOn: ['valueType'],
    changeConfig: (config, { valueType }) => {
      config.writable = valueType === 'expression'
      return config
    }
  }
}))

export const requestConfigList = generateFieldList(defineFormFieldConfig({
  ...advancedConfigMap,
  method: {
    label: '请求方法',
    type: 'radio',
    defaultValue: 'GET',
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' }
    ]
  },
  url: {
    label: '接口地址'
  },
  params: {
    type: 'table',
    label: '参数',
    hideIndex: true,
    options: generateFieldList(defineTableFieldConfig({
      key: {
        label: '键',
        writable: true
      },
      value: {
        label: '值',
        type: 'expression',
        writable: true
      }
    }))
  }
}))

export const changeConfigList = generateFieldList(defineFormFieldConfig({
  ...advancedConfigMap,
  method: {
    label: '请求方法',
    type: 'radio',
    defaultValue: 'GET',
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' }
    ]
  },
  url: {
    label: '接口地址'
  },
  params: {
    type: 'table',
    label: '参数',
    hideIndex: true,
    options: generateFieldList(defineTableFieldConfig({
      key: {
        label: '键',
        writable: true
      },
      value: {
        label: '值',
        type: 'expression',
        writable: true
      }
    }))
  }
}))

export const configList = {
  var: varConfigList,
  request: requestConfigList,
  config: changeConfigList
}

const excludeKeys = [
  'key',
  'otherKey',
  'changeValueType',
  'changeValueStr',
  'valueChangeConfig',
  'changeConfigType',
  'changeConfigStr',
  'configChangeConfig',
  'changeAction'
]
export const getConfigure = async (type) => {
  const res = await getComponentConfigure(type)
  const ret = {
    ...advancedConfigMap
  }
  Reflect.ownKeys(res).forEach(key => {
    if (!excludeKeys.includes(key)) {
      ret[key] = res[key]
    }
  })
  return generateFieldList(ret, configureOptionsFieldConfigMap)
}
