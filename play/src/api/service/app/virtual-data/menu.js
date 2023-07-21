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
          }
          // {
          //   name: 'commonChangeConfig',
          //   title: 'changeConfig'
          // },
          // {
          //   name: 'commonChangeEffect',
          //   title: 'changeEffect'
          // }
        ]
      }

    ]
  },
  PluginsMenu,
  // {
  //   name: '_lowPages',
  //   title: 'Low Pages',
  //   children: [
  //     {
  //       name: '/low/1',
  //       title: 'Low Pages1',
  //       route: '/low/1'
  //     },
  //     {
  //       name: '/low/2',
  //       title: 'Low Pages2',
  //       route: '/low/2'
  //     },
  //     {
  //       name: '/low/3',
  //       title: 'Low Pages3',
  //       route: '/low/3'
  //     }
  //   ]
  // },
  {
    name: '_changelog',
    title: '更新日志',
    children: [
      {
        name: 'dRenderChangelog',
        title: 'd-render'
      }
    ]
  }
]
