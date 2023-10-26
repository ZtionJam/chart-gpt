const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()]
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: "柴特GPT",
        appId: "cn.ztion.gpt",
        copyright: "ZtionJam",
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "柴特GPT"
        },
        publish: {
          provider: "generic",
          url: "http://ztion.cn/GPT"
        },
        win: {
          icon: './public/icon.ico'
        },
        mac: {
          icon: './public/icon/mac/ico.icns'
        }
      }
    }
  }
})
