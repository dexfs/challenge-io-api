module.exports = {
  roots: ['<rootDir>/__tests__'],
  collectCoverageFrom: [
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
}
