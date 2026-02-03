import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSolid } from "@rsbuild/plugin-solid";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSolid(),
  ],

  output: {
    polyfill: "usage",
    overrideBrowserslist: ["firefox 48"],
  },

  source: {
    include: [{ not: /[\\/]core-js[\\/]/ }],
    define: {
      "import.meta.env.ORIGIN": JSON.stringify(process.env.ORIGIN),
      "import.meta.env.FRAME_ORIGIN": JSON.stringify(process.env.FRAME_ORIGIN),
      "import.meta.env.IS_FRAME": JSON.stringify(process.env.IS_FRAME == "true"),
    },
  },
});
