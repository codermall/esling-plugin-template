/**
 * @fileoverview 不允许 var
 * @author Mal
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "不允许 var",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {}, // Add messageId and message
  },

  create(context) {
    // variables should be defined here
    let sourceCode = context.getSourceCode()

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      VariableDeclaration(node) {
        if (node.kind === 'var') {
          context.report({
            node,
            message: '不能用var',
            fix(fixer) {
              const varToken = sourceCode.getFirstToken(node) // 获取当前节点的 token
              return fixer.replaceText(varToken, 'let') // 修复
            }
          })
        }
      }
    };
  },
};
