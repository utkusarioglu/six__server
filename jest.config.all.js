require('dotenv').config({ path: '../.env' });

module.exports = {
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  testURL: 'http://localhost/',

  rootDir: '.', // will be overwritten in the packages
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};
