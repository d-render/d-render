const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  // transpileDependencies: true
  chainWebpack: (config) => {
    config.module.rule('md').test(/\.md$/).use().loader(path.resolve(__dirname, './loaders/markdown-loader.js')).end()
    config.plugin('html').tap(args => {
      args[0].title = 'DRender Docs'
      return args
    })
    return config
  }
})
