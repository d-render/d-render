import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')

const workspacePkgDir: Record<string, string> = {
  'd-render': 'packages/d-render',
  '@d-render/shared': 'packages/shared',
  '@d-render/plugin-standard': 'packages/plugin-standard/core'
}

/** 读取 workspace 内 package.json 的 module / exports.import（与库发布入口一致） */
function resolveWorkspacePkgMain (specifier: string) {
  const relDir = workspacePkgDir[specifier]
  if (!relDir) throw new Error(`[docs/vite] 未配置 workspace 包目录: ${specifier}`)
  const pkgPath = path.join(repoRoot, relDir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
    module?: string
    main?: string
    exports?: { '.': { import?: string } }
  }
  const entry = pkg.module || pkg.exports?.['.']?.import || pkg.main
  if (typeof entry !== 'string') {
    throw new Error(`[docs/vite] ${specifier} 的 package.json 缺少 module / exports.import / main`)
  }
  return path.join(path.dirname(pkgPath), entry)
}

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
      ],
      '/examples/': [
        {
          text: '基础示例',
          collapsible: true,
          items: [
            { text: '表单基础', link: '/examples/basic/form' },
            { text: '搜索表单', link: '/examples/basic/search' },
            { text: '表格基础', link: '/examples/basic/table' }
          ]
        },
        {
          text: '联动示例',
          collapsible: true,
          items: [
            { text: '显示隐藏', link: '/examples/linkage/show-hide' },
            { text: '级联选择', link: '/examples/linkage/cascade' },
            { text: '值派生', link: '/examples/linkage/derive' }
          ]
        },
        {
          text: '高级示例',
          collapsible: true,
          items: [
            { text: '自定义组件', link: '/examples/advanced/custom' },
            { text: '复杂表单', link: '/examples/advanced/complex' },
            { text: '表格联动', link: '/examples/advanced/table-linkage' }
          ]
        }
      ]
    }
  },
  vite: {
    plugins: [vueJsx()],
    resolve: {
      dedupe: ['vue', 'element-plus', 'd-render', '@d-render/shared'],
      // 仅匹配裸入口，避免 `d-render/style` 被拼到 main.js 后面
      alias: [
        { find: /^d-render$/, replacement: resolveWorkspacePkgMain('d-render') },
        { find: /^@d-render\/shared$/, replacement: resolveWorkspacePkgMain('@d-render/shared') },
        { find: /^@d-render\/plugin-standard$/, replacement: resolveWorkspacePkgMain('@d-render/plugin-standard') }
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    ssr: {
      noExternal: [
        'd-render',
        '@d-render/shared',
        '@d-render/plugin-standard',
        '@xdp/button',
        '@xdp/config',
        '@xdp/utils'
      ]
    },
    optimizeDeps: {
      include: [
        'd-render',
        '@d-render/shared',
        '@d-render/plugin-standard',
        'element-plus',
        '@element-plus/icons-vue',
        'lodash-es',
        'dayjs',
        'uuid',
        '@xdp/button',
        '@xdp/config',
        '@xdp/utils'
      ]
    },
    build: {
      dynamicImportVarsOptions: {
        exclude: [/plugin-standard[/\\]core[/\\]esm[/\\]main\.js$/]
      }
    }
  }
})
