export const usePlugins = (plugins) => {
  const modules = []
  const configure = []
  console.log(plugins)
  plugins.forEach(plugin => {
    const { type } = plugin
    if (type === 'modules') {
      modules.push(plugin)
    }
    if (type === 'configure') {
      configure.push(plugin)
    }
  })
  console.log('p', modules, configure)
  return {
    modules,
    configure
  }
}
