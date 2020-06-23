// eslint-disable-next-line no-undef
// const TerserPlugin = require('terser-webpack-plugin')
// eslint-disable-next-line no-undef
module.exports = {
  publicPath: './',
  outputDir: '../pendant/vue',
  productionSourceMap: false,
  css: {
    // 向 CSS 相关的 loader 传递选项
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
