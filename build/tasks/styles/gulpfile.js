import { series, src, dest } from 'gulp'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import consola from 'consola'
import chalk from 'chalk'
import { rimrafSync } from 'rimraf'
import { buildDirResolve } from '../../utils/path'
// const { entry='cip-styles' } = getParamsFromCommand(process.argv)
// console.log('entry',entry, process.env.ENTRY_MODULE)
const entry = process.env.ENTRY_MODULE
if (!entry) {
  throw new Error('process.env.ENTRY_MODULE 必须为具体路径')
}
rimrafSync(buildDirResolve(`../../../packages/${entry}/dist`))
const css = () => {
  return src(`../../../packages/${entry}/src/index.less`)
    .pipe(less({
      modifyVars: {
        '@elNamespace': 'el'
      }
    }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, details => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(dest(`../../../packages/${entry}/dist`))
}

const epCss = () => {
  return src(`../../../packages/${entry}/src/index.less`)
    .pipe(less({
      modifyVars: {
        '@elNamespace': 'ep'
      }
    }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(rename({}))
    .pipe(
      cleanCSS({}, details => {
        consola.success(
                    `${chalk.cyan(details.name)}: ${chalk.yellow(
                        details.stats.originalSize / 1000
                    )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(rename('ep.css'))
    .pipe(dest(`../../../packages/${entry}/dist`))
}
export default series(css, epCss)
