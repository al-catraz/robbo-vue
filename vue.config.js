const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  configureWebpack: (config) => {
    const isProduction = config.mode === 'production';
    const plugins = [
      new StyleLintPlugin({
        files: ['src/**/*.{vue,scss}'],
      }),
    ];

    return {
      devtool: isProduction ? 'hidden-source-map' : false,
      plugins,
    };
  },
  lintOnSave: 'warning',
  outputDir: 'build',
  publicPath: '/',
};
