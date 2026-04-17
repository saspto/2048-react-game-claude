export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: { '\\.(css|less|scss)$': '<rootDir>/__mocks__/fileMock.js' },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
}
