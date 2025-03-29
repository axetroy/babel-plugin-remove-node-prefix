import assert from "node:assert";
import test, { describe } from "node:test";

import { transformSync } from "@babel/core";
import prettier from "prettier";
import outdent from "outdent";
import babelCoreFrame from "@babel/code-frame";

import babelPluginRemoveNodePrefix from "../src/index";

function formatCode(code: string) {
  return prettier.format(code, { parser: "babel" });
}

async function assertCode(code: string, output: string) {
  assert.strictEqual(await formatCode(code), await formatCode(output));
}

function paddingLines(code: string, padding: number) {
  const lines = code.split("\n");
  return lines.map((line) => " ".repeat(padding) + line).join("\n");
}

type TestCase = [string | string[], string]

function testSnapshot(name: string, codes: Array<TestCase>) {
  describe(`transform-fs-promises: ${name}`, () => {
    for (const code of codes) {
      const inputs = Array.isArray(code[0]) ? code[0] : [code[0]];

      for (const input of inputs) {
        test(input, async (t) => {
          const result = transformSync(input, {
            plugins: [babelPluginRemoveNodePrefix],
          });
  
          if (Array.isArray(code) && code.length > 1) {
            const output = code[1];
            assert(result);
            await assertCode(result.code!, output);
          }
  
          const markdown = outdent`
          ### Input
  
          ${paddingLines(babelCoreFrame(input, 0, 0, {}), 4)}
  
          ### Output
          
          ${paddingLines(babelCoreFrame(result?.code!, 0, 0, { linesAbove: Infinity, linesBelow: Infinity }), 4)}
          `;
  
          t.assert.snapshot(markdown, {
            serializers: [(value) => value],
          });
        });
      }
    }
  });
}

const cjs: Array<TestCase> = [
  // cjs: import default
  [
    `const fs = require("node:fs");`,
    `const fs = require("fs");`,
  ],
  // cjs: import named
  [
    `const { readFile } = require("node:fs");`,
    `const { readFile } = require("fs");`
  ],
  // cjs: import multiple named
  [
    `const { readFile, stat } = require("node:fs");`,
    `const { readFile, stat } = require("fs");`,
  ],
]

testSnapshot('cjs', cjs);

const esm: Array<TestCase> = [
  // esm: import dynamic
  [
    `const fs = import("node:fs");`,
    `const fs = import("fs");`,
  ],
  // esm: import default
  [
    `import fs from "node:fs";`,
    `import fs from "fs";`,
  ],
  // esm: import named
  [
    `import { readFile } from "node:fs";`,
    `import { readFile } from "fs";`,
  ],
  // esm: import multiple named
  [
    `import { readFile, stat } from "node:fs";`,
    `import { readFile, stat } from "fs";`,
  ],
  // esm: import default + named
  [
    `import fs, { readFile } from "node:fs";`,
    `import fs, { readFile } from "fs";`
  ],
  // esm: export all
  [
    `export * from "node:fs";`,
    `export * from "fs";`,
  ],
  // esm: export named
  [
    `export { readFile } from "node:fs";`,
    `export { readFile } from "fs";`,
  ],
  // esm: export default
  [
    `export * as fs from "node:fs";`,
    `export * as fs from "fs";`,
  ],
]

testSnapshot('esm', esm);
