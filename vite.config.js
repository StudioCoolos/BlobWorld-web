import { defineConfig } from "vite";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [viteBasicSslPlugin()],
});
