module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**/*.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {}]
  },
  setupFiles: ['<rootDir>/src/tests/setup.ts']
};