// jest.config.js
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  // globalSetup: "jest-preset-angular/global-setup",
  moduleNameMapper: {
    '@meeui/ui/(.*)$': '<rootDir>/projects/mee/src/lib/$1/public-api.ts',
  },
};
