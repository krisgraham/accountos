import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: 'shared',
          include: ['packages/shared/src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'server',
          include: ['packages/server/src/**/*.test.ts'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'client',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['packages/client/src/test-setup.ts'],
          include: ['packages/client/src/**/*.test.{ts,tsx}'],
        },
      },
    ],
  },
});
