import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.json"
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AdaBourseCore",
      fileName: "index",
      formats: ["es", "cjs"]
    },
    sourcemap: true,
    rollupOptions: {
      external: ["tslib"]
    }
  }
});

