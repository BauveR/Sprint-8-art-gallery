import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'frontend',
      include: ['src/**/*.test.{ts,tsx}'],
      environment: 'jsdom',
    },
  },
  {
    test: {
      name: 'backend',
      include: ['api/tests/**/*.test.ts'],
      environment: 'node',
    },
  },
]);
