import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

export default defineConfig({
  fmt: {
    ignorePatterns: ["worker-configuration.d.ts"],
  },
  lint: {
    plugins: ["react", "typescript", "oxc"],
    ignorePatterns: ["worker-configuration.d.ts"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkGfm] }) },
    react(),
    cloudflare(),
  ]),
});
