# babel-plugin-remove-node-prefix

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
![Node](https://img.shields.io/badge/node-%3E=14-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/babel-plugin-remove-node-prefix.svg)](https://badge.fury.io/js/babel-plugin-remove-node-prefix)

A Babel plugin to remove node prefix.

Compatible with `Babel@^7.0.0`.

## Installation

```bash
npm install babel-plugin-remove-node-prefix --save
```

## Usage

```js
// import via esm
import babelPluginRemoveNodePrefix from "babel-plugin-remove-node-prefix";

// import via cjs
const babelPluginRemoveNodePrefix = require("babel-plugin-remove-node-prefix");
```

```js
import { transformSync } from "@babel/core";
import babelPluginRemoveNodePrefix from "babel-plugin-remove-node-prefix";

const code = `
import fs from 'node:fs'
`;

const result = transformSync(code, {
    plugins: [babelPluginRemoveNodePrefix],
});

console.log(result.code);

// Output:

/**

import fs from 'fs'

*/
```

## License

The [Anti 996 License](LICENSE)
