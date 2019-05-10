module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./after-env-setup.ts'],
  runner: './integration-test-runner.js',
};
