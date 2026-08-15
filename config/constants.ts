import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config();

export type Environment = 'dev' | 'test' | 'stage' | 'prod';
export type Application = 'DEMO' | string;
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | string;

export const TEST_ENV: Environment = (process.env.TEST_ENV || process.env.ENV || 'dev') as Environment;
export const TEST_APP: Application = process.env.TEST_APP || 'DEMO';
export const DEVICE: DeviceType = process.env.DEVICE || 'desktop';

export const DEFAULT_TIMEOUT = 30000;
export const NAVIGATION_TIMEOUT = 30000;
export const EXPECT_TIMEOUT = 5000;
