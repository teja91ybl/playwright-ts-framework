import dotenv from 'dotenv';
import path from 'path';
import { Environment, Application, DeviceType, TEST_ENV, TEST_APP, DEVICE } from './constants';

// Ensure dotenv is loaded
dotenv.config();

export interface EnvironmentConfig {
  env: Environment;
  app: Application;
  device: DeviceType;
}

export const currentConfig: EnvironmentConfig = {
  env: TEST_ENV,
  app: TEST_APP,
  device: DEVICE
};

export function getEnvironmentConfig(): EnvironmentConfig {
  return currentConfig;
}
