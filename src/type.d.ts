import Babel, { PluginObj } from "@babel/core";

declare function babelPluginRemoveNodePrefix(babel: typeof Babel): PluginObj;

export { babelPluginRemoveNodePrefix };
export default babelPluginRemoveNodePrefix;
