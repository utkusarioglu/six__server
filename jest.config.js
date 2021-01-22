const baseConfig = require('./jest.config.all');

module.exports = {
  ...baseConfig,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.{ts,tsx}'],
};
