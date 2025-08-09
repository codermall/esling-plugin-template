const mal = require('eslint-plugin-mal')

module.exports = {
  plugins: {
    mal: mal
  },
  rules: {
    "mal/no-var": ['error']
  }
}