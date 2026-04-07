import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'd-render',
  description: '基于 Element Plus 二次封装的数据驱动渲染组件库',
  base: '/d-render/',
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  themeConfig: {
    repo: 'd-render/d-render',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
      { text: '更新日志', link: '/changelog/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          collapsible: true,
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '核心概念', link: '/guide/core-concepts' }
          ]
        },
        {
          text: '基础',
          collapsible: true,
          items: [
            { text: '表单 Form', link: '/guide/form' },
            { text: '搜索表单 SearchForm', link: '/guide/search-form' },
            { text: '表格 Table', link: '/guide/table' }
          ]
        },
        {
          text: '进阶',
          collapsible: true,
          items: [
            { text: '数据联动', link: '/guide/dependon' },
            { text: 'otherKey 详解', link: '/guide/otherkey' },
            { text: '自定义 type', link: '/guide/custom-type' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '配置项', link: '/api/config' },
            { text: '方法', link: '/api/methods' },
            { text: '事件', link: '/api/events' }
          ]
        }
      ]
    }
  }
})
