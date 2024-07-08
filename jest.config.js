module.exports = {
  silent: false,
  moduleFileExtensions: ['js', 'ts'],
  rootDir: '.',
  testRegex: '[.](spec|test).ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/'],
  moduleNameMapper: {
    '^@/core(.*)': '<rootDir>/src/core/$1',
    '^@/infra(.*)': '<rootDir>/src/infra/$1',
    '^@/shared(.*)': '<rootDir>/src/shared/$1',
  },
};
