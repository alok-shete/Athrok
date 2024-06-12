import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import cleanup from 'rollup-plugin-cleanup'


import { resolve } from "path";

import { peerDependencies } from "./package.json";

export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: true,
    lib: {
      name: "athrok",
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs", "umd"],
      fileName: "index",
    },

    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
      plugins: [typescript({ tsconfig: "./tsconfig.json" }),cleanup({
        comments: 'none'
      }) ],
      output: {
        globals: {
          react: "React",
        },
        exports: "named",
      },
    },
  },
});
