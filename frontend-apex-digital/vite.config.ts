import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    {
      name: 'figma-asset-resolver',
      enforce: 'pre',
      resolveId(source) {
        if (!source.startsWith('figma:asset/')) {
          return null
        }

        const requestedFile = source.replace('figma:asset/', '')
        const assetsDir = path.resolve(__dirname, './assets')

        const directPath = path.resolve(assetsDir, requestedFile)
        if (fs.existsSync(directPath)) {
          return directPath
        }

        const lowerCasePath = path.resolve(assetsDir, requestedFile.toLowerCase())
        if (fs.existsSync(lowerCasePath)) {
          return lowerCasePath
        }

        const requestedBaseName = path.parse(requestedFile).name.toLowerCase()

        if (fs.existsSync(assetsDir)) {
          const matchedFile = fs.readdirSync(assetsDir).find((file) => {
            return path.parse(file).name.toLowerCase() === requestedBaseName
          })

          if (matchedFile) {
            return path.resolve(assetsDir, matchedFile)
          }
        }

        return null
      },
    },
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
})