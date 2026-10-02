import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
    publicDir: false,
    plugins: [viteSingleFile()],
    build: {
        outDir: "dist-singlefile",
        emptyOutDir: true,
        cssCodeSplit: false,
        assetsInlineLimit: 100_000_000,
        chunkSizeWarningLimit: 100_000_000,
    },
});