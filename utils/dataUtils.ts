import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

export class DataUtils {
  /**
   * Reads and parses a JSON file from specified path relative to project root.
   */
  public static readJson<T>(filePath: string): T {
    try {
      const resolvedPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(process.cwd(), filePath);
      Logger.info(`Reading JSON file from: ${resolvedPath}`);
      const rawData = fs.readFileSync(resolvedPath, 'utf-8');
      return JSON.parse(rawData) as T;
    } catch (error) {
      Logger.error(`Failed to read JSON file at '${filePath}'`, error);
      throw error;
    }
  }

  /**
   * Generates a random alphanumeric string of a specified length.
   */
  public static getRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random email address.
   */
  public static getRandomEmail(prefix: string = 'test'): string {
    return `${prefix}_${Date.now()}@example.com`;
  }
}
