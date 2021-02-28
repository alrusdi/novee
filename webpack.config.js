'use strict'

const process = require("process");

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: [
    './build/client/Main.js'
  ],
  stats: {
    warnings: true
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
}