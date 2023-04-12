import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
    server: {    // <-- this object is added
        port: 80,
    },
    runtimeConfig: {
        public: {
            baseURL: 'https://api.example.com/',
        },
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
})
