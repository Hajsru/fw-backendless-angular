const baseConfig = require('../../jest/jest.base.config');

module.exports = {
  ...baseConfig,
  name: 'ha-js-core',
  globals: {
    'ts-jest': {
      tsConfigFile: '<rootDir>/projects/ha-js-app/tsconfig.spec.json'
    },
    "__TRANSFORM_HTML__": true,
  },
  roots: [
    '<rootDir>/projects/ha-js-app'
  ]
};
