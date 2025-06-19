module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'models/**/*.js',
    'controllers/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    '!**/__tests__/**'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js'
  ]
};

