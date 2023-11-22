
export default function (options) {
  let retPath
  return {
    name: 'rollup-plugin-alias',
    options: (rollupOptions) => {
      const ret = rollupOptions.input.replace(options.rootDir, '').split('/').length - 2
      retPath = ret === 0
        ? '.'
        : new Array(ret).fill('..').join('/') + '/'
    },
    resolveId: function (importPath, importer) {
      if (/@\//.test(importPath)) {
        return importPath.replace(options.rootDir).replace('@/', retPath)
      }
    }
  }
}
