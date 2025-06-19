module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/__tests__/unit/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/models/**/*.js',
    'src/controllers/**/*.js',
    'src/utils/**/*.js',
    '!src/__tests__/**'
  ],
  testTimeout: 10000,
  verbose: true
};
