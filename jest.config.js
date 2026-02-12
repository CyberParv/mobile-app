module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(expo|react-native|nativewind|@react-native)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: ['app/**', 'components/**', 'hooks/**', 'providers/**', 'lib/**']
};