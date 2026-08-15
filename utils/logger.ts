export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  public static info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  public static warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  public static error(message: string, error?: unknown): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error(error);
    }
  }

  public static debug(message: string): void {
    if (process.env.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }

  public static step(stepName: string): void {
    console.log(this.formatMessage('STEP', `---> ${stepName}`));
  }
}
