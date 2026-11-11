import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import vike from "vike/plugin";
import remarkGfm from "remark-gfm";

export default defineConfig({
  fmt: {
    // 教材の中身は対象外。Oxfmt は MDX frontmatter の initialCode (テンプレートリテラル) の
    // インデントを壊し、docs のコードブロック内のサンプルコードも書き換える
    ignorePatterns: ["worker-configuration.d.ts", "**/*.mdx", "docs/**"],
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
    vike({}),
    cloudflare(),
  ]),
});
