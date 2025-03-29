import type Babel from "@babel/core";
import type { PluginObj } from "@babel/core";

function babelPluginRemoveNodePrefix(babel: typeof Babel) {
    const { types: t } = babel;

    return {
        name: "remove-node-prefix",
        visitor: {
            StringLiteral(path) {
                const isImportOrRequire =
                    t.isImportDeclaration(path.parent) ||
                    (t.isCallExpression(path.parent) &&
                        ((t.isIdentifier(path.parent.callee) &&
                            (path.parent.callee.name === "require" || path.parent.callee.name === "import")) ||
                            t.isImport(path.parent.callee)));

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
