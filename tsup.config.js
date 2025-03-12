import { defineConfig } from "tsup";
import fs from "fs-extra";

export default defineConfig({
  entry: {
    index: "src/components/index.tsx",
    types: "src/types.ts",
    "tailwind.config": "./tailwind.config.js",
  },
  dts: true,
  format: ["esm"],
  shims: false,
  clean: true,
  treeshake: true,
  sourcemap: false,
  outDir: "lib",
  onSuccess: async () => {
    await fs.copy("public", "lib/public");
  },
});
