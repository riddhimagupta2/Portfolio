import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = import.meta.dirname || path.dirname(fileURLToPath(import.meta.url));

// If private local portfolioData.js is present (local dev), use it; otherwise (Vercel/GitHub), fallback to portfolioData.public.js
const localDataPath = path.resolve(currentDir, 'src/data/portfolioData.js');
const publicDataPath = path.resolve(currentDir, 'src/data/portfolioData.public.js');
const activeDataPath = fs.existsSync(localDataPath) ? localDataPath : publicDataPath;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '../data/portfolioData': activeDataPath,
      './data/portfolioData': activeDataPath,
    }
  }
});
