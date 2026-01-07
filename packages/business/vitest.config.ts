import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      'hayahub-shared': path.resolve(__dirname, '../shared/src'),
      'hayahub-domain': path.resolve(__dirname, '../domain/src'),
    },
  },
});
