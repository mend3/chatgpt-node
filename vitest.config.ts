import { PluginOption } from 'vite/dist/node/index';
import { defineConfig } from 'vitest/config';

const plugins: PluginOption[] = [];

if (process.env.TEST_TYPE !== 'UNIT') {
  plugins.push({
    name: 'integration-test-setup',
    config: () => ({
      test: {
        setupFiles: ['./tests/config/setup.ts'],
        teardownTimeout: 10000,
      },
    }),
  });
}

export default defineConfig({
  plugins: [],
  test: {
    env: {},
    logHeapUsage: false,
    allowOnly: false,
    silent: false,
    globals: true,
    mockReset: true,
    clearMocks: true,
    hookTimeout: 60_000,
    testTimeout: 10_000,
    coverage: {
      all: true,
      include: ['src/**'],
      exclude: ['src/index.ts', 'src/chatgpt.ts', 'src/logger.ts', 'src/global.d.ts'],
      lines: 99,
      branches: 99,
      functions: 99,
      statements: 99,
    },
  },
});
