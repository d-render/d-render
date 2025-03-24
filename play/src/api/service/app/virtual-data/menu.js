import PluginsMenu from '@/api/service/app/virtual-data/plugins-menu'
export const menu = [
  {
    name: '_components',
    title: '组件',
    children: [
      {
        name: '_cipCore',
        title: '核心组件',
        type: 'group',
        children: [
          {
            name: 'form',
            title: 'CipForm'
          },
          {
            name: 'searchForm',
            title: 'CipSearchForm'
          },
          {
            name: 'table',
            title: 'CipTable'
          }
        ]
      },
      // {
      //   name: '_cipHelpComponent',
      //   title: '辅助组件',
      //   type: 'group',
      //   children: [
      //     {
      //       name: 'commonChangeValue',
      //       title: 'CipFormTransformInput'
      //     }
      //   ]
      // },
      {
        name: '_cipConfig',
        title: '通用配置',
        type: 'group',
        children: [
          // {
          //   name: 'commonDependOn',
          //   title: 'dependOn'
          // },
          {
            name: 'commonChangeValue',
            title: 'changeValue'
          },
          {
            name: 'commonChangeConfig',
            title: 'changeConfig'
          }
          // {
          //   name: 'commonChangeEffect',
          //   title: 'changeEffect'
          // }
        ]
      }

    ]
  },
  PluginsMenu,
  {
    name: '_playground',
    title: 'Playground',
    children: [
      {
        name: 'PlaygroundFormDesign',
        title: 'FormDesign'
      },
      {
        name: 'PlaygroundCustomFormDesign',
        title: 'FormDesign',
        badge: 'custom'
      },
      {
        name: 'PlaygroundTableDesign',
        title: 'TableDesign'
      },
      {
        name: 'PlaygroundPageDesign',
        title: 'PageDesign'
      }
    ]
  },
  {
    name: '_changelog',
    title: '更新日志',
    children: [
      {
        name: 'dRenderChangelog',
        title: 'd-render'
      }
    ]
  },
  {
    name: '_develop',
    title: '开发广场',
    children: [
      { name: 'DrTableBase', title: '行编辑表格' }
    ]
  }
]
