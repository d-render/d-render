import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import resolverExtension from '../rollup-plugins/rollup-plugin-resolver-extension.js'
// import terser from '@rollup/plugin-terser'
export const components = {
  resolve: {},
  plugins: [
    vue(),
    vueJsx(),
    resolverExtension(),
    commonjs(),
    nodeResolve(),
    esbuild({
      target: 'es6'
    })
    // terser()
  ],
  external: [/\.+\//]
}
