const path = require('node:path')
const { TanStackRouterWebpack } = require('@tanstack/router-plugin/webpack')

module.exports = {
  config: (config) => {
    config.resolve ??= {}
    config.resolve.alias ??= {}
    config.resolve.alias['~'] = path.resolve(__dirname)
    config.plugins ??= []
    config.plugins.push(TanStackRouterWebpack())
    return config
  },
}
