// @ts-check
const path = require('node:path')
const { TanStackRouterWebpack } = require('@tanstack/router-plugin/webpack')
const { merge } = require('webpack-merge')

module.exports = {
  /**
   *
   * @param {import('webpack').Configuration} config
   * @returns
   */
  config: (config) => {
    const merged = merge(config, {
      resolve: {
        alias: {
          '~': path.resolve(__dirname),
        },
      },
      plugins: [TanStackRouterWebpack()],
    })
    return merged
  },
}
