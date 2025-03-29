const { transformSync } = require("@babel/core");
const babelPluginRemoveNodePrefix = require("babel-plugin-remove-node-prefix");

console.log(babelPluginRemoveNodePrefix);

const input = `
const fs = require('fs/promises');
`;

const result = transformSync(input, {
  plugins: [babelPluginRemoveNodePrefix],
});

console.log(result.code);
