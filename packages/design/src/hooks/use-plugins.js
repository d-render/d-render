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
    console.log(plugin)
    if (type === 'draw') {
      draw = plugin
    }
  })
  console.log('p', modules, configure, draw)
  return {
    modules,
    configure,
    draw
  }
}
