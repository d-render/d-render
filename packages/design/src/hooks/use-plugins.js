export const usePlugins = (plugins) => {
  const modules = []
  const configure = []
  let draw = {}
  plugins.forEach(plugin => {
    const { type } = plugin
    if (type === 'modules') {
      modules.push(plugin)
    }
    if (type === 'configure') {
      configure.push(plugin)
    }
    if (type === 'draw') {
      draw = plugin
    }
  })
  return {
    modules,
    configure,
    draw
  }
}
