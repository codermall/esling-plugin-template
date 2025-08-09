可共享的 ESLint 插件创建
创建开发环境
monorepo 项目，使用 pnpm 管理。

创建 eslint-plugin-mal 和 guide 两个依赖包。一个是插件，一个是使用该插件。
使用 ESLint 构建工具创建 ESLint 插件
npm install yo generator-eslint -g
运行命令 yo eslint:plugin ，然后按提示填写
这里要特别说明一下的是 ESLint 的插件 npm 包的名称必须以 eslint-plugin- 开头。上面使用 yo eslint:plugin 创建 ESLint 插件时，plugin name虽然填写的是 'mal' ，单最终生成的是 eslint-plugin-mal

{
  "name": "eslint-plugin-mal",
  "version": "0.0.0",
  "description": "self test eslint plugin",
  "keywords": [
    "eslint",
    "eslintplugin",
    "eslint-plugin"
  ],
  "author": "Mal"
  // ...
}
生成规则，命令 yo eslint:rule，按提示填写
mal@malindeMacBook-Air eslint-plugin-mal % yo eslint:rule
? What is your name? Mal
? Where will this rule be published? ESLint Plugin
? What is the rule ID? no-var
? Type a short description of this rule: 不允许 var
? Type a short example of the code that will fail: 
   create docs/rules/no-var.md
   create lib/rules/no-var.js
   create tests/lib/rules/no-var.js
接着会在 lib 目录下生成一个 rules 目录及一个 no-var.js 的文件。

调试及编写 ESLint 插件
根目录安装自己的插件 eslint-plugin-mal ，遵循 workspace 协议
pnpm install "eslint-plugin-mal@workspace:*" -w
进入 guide ，配置创建好的 ESLint 插件 eslint.config.mjs 是 9 版本以上约定的扁平化处理方案，允许使用 import 插件处理（之前是配置化，无需引入）。
import mal from 'eslint-plugin-mal'

export default [
  { 
    files: ["**/*.js"], 
    plugins: {
      mal: mal
    },
    rules: {
      "mal/no-var": ["error"]
    }
  }
]
创建测试文件 test.js，内容 var a = 'mal'
继续写 eslint-plugin-mal 插件的 no-var 规则
module.exports = {
  create(context) {
    return {
      VariableDeclaration(node) {
        console.log(node)
      }
    }
  }
}
在 guide 中执行插件, npx eslint test.js，可以查看打印的 node 节点信息
通过上下文对象 context.report() 发出警告或修复错误
module.exports = {
  create(context) {
    return {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          context.report({
            node,
            message: '不能用var'
          })
        }
      }
    }
  }
}
继续执行插件, npx eslint test.js：
mal@malindeMacBook-Air guide % npx eslint test.js

/Users/mal/Desktop/my_git/mal-eslint/packages/guide/test.js
  1:1  error  不能用var  mal/no-var

✖ 1 problem (1 error, 0 warnings)
如何修复代码
修复代码的时候规则中 meta.fixable 属性值必须为：code，我们要修复代码则可以在 context.report() 方法的参数对象中传递一个 fix() 函数，这个 fix() 函数有一个回调参数对象 fixer 就提供了各种修改方法.

修复代码的核心原理就是通过当前的 AST 节点信息找到对应的 tokens 中的具体 token，因为只有 tokens 中的 token 才详细记录了字符标记的具体位置信息内容.

获取 SourceCode 对 AST 二次封装的实例对象：let sourceCode = context.getSourceCode()
获取当前节点的 token 信息: let varToken = sourceCode.getFirstToken()
通过 fixer.replaceText() 修复
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: '自定义插件',
      recommended: false,
      url: null // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {}
  },

  create(context) {
    const sourceCode = context.getSourceCode() // 获取 SourceCode 二次封装 AST 的实例
    return {
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          context.report({
            node,
            message: '不能用var',
            fix(fixer) {
              const varToken = sourceCode.getFirstToken(node)
              return fixer.replaceText(varToken, 'let')
            }
          })
        }
      }
    }
  }
}
再运行 npx eslint test.js --fix 要修复代码必须加 --fix 此时就完成修复了
插件规则配置集成共享
一个插件下可能存在很多的规则的，如果我们去一个一个的配置非常的麻烦，所以在开发这个插件的时候可以把相关的规则集成一个组合推荐给用户。

在 lib/index.js 下进行配置 (遵循 eslit9 版本)
const plugin = {
  meta: {},
	configs: {},
	rules: requireIndex(__dirname + "/rules"), // import all rules in lib/rules
	processors: {},
}

Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      mal: plugin
    },
    rules: {
      "mal/no-var": "error"
    }
  }
})
// import all rules in lib/rules
module.exports = plugin
用户使用集成配置：
import mal from 'eslint-plugin-mal'

export default [
  mal.configs.recommended, // 集成的配置
  { 
    files: ["**/*.js"], 
    plugins: {
      mal: mal
    },
    rules: {
      // "mal/no-var": ["error"]
    }
  }
]
执行 npx eslint test.js --fix 要修复代码必须加 --fix 此时能正常修复
