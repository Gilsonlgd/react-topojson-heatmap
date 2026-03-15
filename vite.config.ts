import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import libcss from "vite-plugin-libcss";
import path from "path";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), libcss()],
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "react-topojson-heatmap",
      fileName: (format) => `react-topojson-heatmap.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-dom/server"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "react-dom/server": "ReactDOMServer",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      hooks: path.resolve(__dirname, "./src/hooks"),
      utils: path.resolve(__dirname, "./src/utils"),
      types: path.resolve(__dirname, "./src/types"),
      components: path.resolve(__dirname, "./src/components"),
      providers: path.resolve(__dirname, "./src/providers"),
    },
  },
});
