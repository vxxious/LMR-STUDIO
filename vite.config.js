import { defineConfig } from "vite"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about/index.html"),
        booking: resolve(__dirname, "booking/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        gallery: resolve(__dirname, "gallery/index.html"),
        pricing: resolve(__dirname, "pricing/index.html"),
        services: resolve(__dirname, "services/index.html"),
        policy: resolve(__dirname, "policy/index.html")
      }
    }
  }
})
