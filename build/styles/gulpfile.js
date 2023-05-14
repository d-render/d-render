import { series, src, dest, watch as gulpWatch } from 'gulp';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import consola from 'consola';
import chalk from 'chalk';
import { rimrafSync } from 'rimraf';
import { buildDirResolve } from '../utils/path';
import { getParamsFromCommand } from '../utils/tool';
const { entry = 'd-render', watch } = getParamsFromCommand(process.argv);
console.log('entry', entry, watch);

rimrafSync(buildDirResolve(`../../packages/${entry}/dist`));
const css = () => {
  return src(`../../packages/${entry}/src/index.less`)
    .pipe(less())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        );
      })
    )
    .pipe(dest(`../../packages/${entry}/dist`));
};

const epCss = () => {
  return src(`../../packages/${entry}/src/index.less`)
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
        );
      })
    )
    .pipe(rename('ep.css'))
    .pipe(dest(`../../packages/${entry}/dist`));
};
// 开启监听
if (watch) gulpWatch(`../../packages/${entry}/src/**`, series);
export default series(css, epCss);
