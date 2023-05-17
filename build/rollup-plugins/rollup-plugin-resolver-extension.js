import { sep } from 'node:path'

const mayBeSubFileExtension = ['index.js', 'index.vue', 'index.jsx']
const mayBeFileExtension = ['.js', '.jsx', '.vue']

async function findResolution (
  resolve,
  mode = 'sep',
  source,
  importer,
  options,
  extensions
) {
  const sourceWithExt = extensions.map(ext =>
    mode === 'sep' ? source + sep + ext : source + ext
  )
  const allMayBeSource = sourceWithExt.map(p =>
    resolve(p, importer, {
      skipSelf: true,
      ...options
    })
  )
  const extResolutions = await Promise.all(allMayBeSource)
  return extResolutions.find(res => !!res)
}

export default function resolverExtension () {
  return {
    name: 'rollup-plugin-resolver-extension',
    async resolveId (source, importer, options) {
      const resolution = await this.resolve(source, importer, {
        skipSelf: true,
        ...options
      })
      if (!resolution) {
        const resolutionExt = await findResolution(
          this.resolve,
          'plus',
          source,
          importer,
          options,
          mayBeFileExtension
        )
        if (resolutionExt) {
          return resolutionExt.id
        }
        const resolutionFileExt = await findResolution(
          this.resolve,
          'sep',
          source,
          importer,
          options,
          mayBeSubFileExtension
        )
        if (resolutionFileExt) {
          return resolutionFileExt.id
        }
      }
      return null
    }
  }
}
