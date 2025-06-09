import {fileURLToPath, URL} from 'node:url'
import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    css: {
        postcss: './postcss.config.js',
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    }
})
