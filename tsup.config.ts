import { defineConfig } from "tsup";
import fs from "fs";
import pkg from "./package.json";

import plugin from "node-stdlib-browser/helpers/esbuild/plugin";
import ifdef from "esbuild-plugin-ifdef";
// import ifdefPlugin from "esbuild-ifdef";
import stdLibBrowser from "node-stdlib-browser";

const BANNER = fs
  .readFileSync("src/meta.js", "utf8")
  .replace("process.env.VERSION", pkg.version);

// process.env.DEBUG = "true";
export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  clean: true,
  format: ["iife"],
  outExtension() {
    return {
      js: `.user.js`,
    };
  },
  banner: {
    js: `${BANNER}
var priKey = "0xPUT_YOUR_PRIVATE_KEY_HERE";
//e.g. var priKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";`,
  },
  platform: "browser",
  //https://github.com/evanw/esbuild/issues/1626
  inject: ["node_modules/node-stdlib-browser/helpers/esbuild/shim.js"],
  define: {
    global: "window",
    process: "process",
    Buffer: "Buffer",
  },
  esbuildPlugins: [ifdef()],
  plugins: [plugin(stdLibBrowser)],
});
