const TestRunner = require('jest-runner');

module.exports = class SerialRunner extends TestRunner {
  constructor(...args) {
    super(...args);
    this.isSerial = true;
  }
};
