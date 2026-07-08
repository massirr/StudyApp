/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  // Unit tests live in src/**; Playwright e2e lives in tests/** (run via `npm run test`).
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
