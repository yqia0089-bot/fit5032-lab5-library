import {
  fileURLToPath,
  URL,
} from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repositoryName =
  'fit5032-lab5-library'

const isGitHubPages =
  process.env.DEPLOY_TARGET ===
  'github-pages'

export default defineConfig({
  base: isGitHubPages
    ? `/${repositoryName}/`
    : '/',

  plugins: [
    vue(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url),
      ),
    },
  },
})