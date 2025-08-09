// import mal from 'eslint-plugin-mal'
import malConfigLint from 'eslint-config-mallint'

export default [
  // mal.configs.recommended,  // 使用集成配置
  // { 
  //   files: ["**/*.js"], 
  //   plugins: {
  //     mal: mal
  //   },
  //   rules: {
  //     // "mal/no-var": ["error"]
  //   }
  // }
  malConfigLint, // 使用 公共配置
]