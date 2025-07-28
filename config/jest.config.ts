import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.test.json';
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: '80%',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: '../',
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      { tsconfig: './config/tsconfig.test.json', isolatedModules: false },
    ],
  },
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};

export default jestConfig;
