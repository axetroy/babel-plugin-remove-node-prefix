import type Babel from "@babel/core";
import type { PluginObj } from "@babel/core";

function babelPluginRemoveNodePrefix(babel: typeof Babel) {
    const { types: t } = babel;

    return {
        name: "remove-node-prefix",
        visitor: {
            StringLiteral(path) {
                const { parent } = path;

                const isImportOrRequire =
                    t.isImportDeclaration(parent) ||
                    t.isExportAllDeclaration(parent) ||
                    t.isExportNamedDeclaration(parent) ||
                    (t.isCallExpression(parent) &&
                        (t.isImport(parent.callee) ||
                            t.isIdentifier(parent.callee, { name: "require" }) ||
                            t.isIdentifier(parent.callee, { name: "import" })));

                if (isImportOrRequire && path.node.value.startsWith("node:")) {
                    // Remove `node:` prefix from the path
                    path.replaceWith(babel.types.stringLiteral(path.node.value.slice(5)));
                }
            },
        },
    } satisfies PluginObj<Babel.PluginPass>;
}

export { babelPluginRemoveNodePrefix };
export default babelPluginRemoveNodePrefix;
