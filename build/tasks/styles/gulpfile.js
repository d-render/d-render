import { series, src, dest, watch as gulpWatch } from 'gulp'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import consola from 'consola'
import chalk from 'chalk'
import { rimrafSync } from 'rimraf'
import { buildDirResolve } from '../../utils/path.js'
import { getParamsFromCommand } from '../../utils/tool.js'
const { entry = process.env.ENTRY_MODULE, watch } = getParamsFromCommand(process.argv)
console.log('entry', entry, watch)
const projectPath = `../../../packages/${entry}`
rimrafSync(buildDirResolve(`${projectPath}/dist`))
const css = () => {
  return src(`${projectPath}/src/index.less`)
    .pipe(less())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(dest(`${projectPath}/dist`))
}

const epCss = () => {
  return src(`${projectPath}/src/index.less`)
    .pipe(
      less({
        modifyVars: {
          '@elNamespace': 'ep'
        }
      })
    )
    .pipe(autoprefixer({ cascade: false }))
    .pipe(rename({}))
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(rename('ep.css'))
    .pipe(dest(`${projectPath}/dist`))
}
// 开启监听
if (watch) gulpWatch(`../../packages/${entry}/src/**`, series)
export default series(css, epCss)
