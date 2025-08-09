/**
 * @fileoverview self test eslint plugin
 * @author Mal
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

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
      "mal/no-var": ["error"]
    }
  }
})
// import all rules in lib/rules
module.exports = plugin



