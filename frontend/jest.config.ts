import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom', // Or 'node', depending on your setup
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to handle TypeScript files
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

export default config;

