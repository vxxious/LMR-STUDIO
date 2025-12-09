import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
server: {
port: 3000
},
build: {
rollupOptions: {
input: {
index: resolve(__dirname, 'index.html'),
booking: resolve(__dirname, 'booking.html'),
about: resolve(__dirname, 'about.html'),
contact: resolve(__dirname, 'contact.html'),
gallery: resolve(__dirname, 'gallery.html'),
pricing: resolve(__dirname, 'pricing.html'),
services: resolve(__dirname, 'services.html'),
policy: resolve(__dirname, 'policy.html')
}
}
}
})