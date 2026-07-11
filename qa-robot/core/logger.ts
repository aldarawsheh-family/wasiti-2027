import chalk from 'chalk';

export enum LogLevel {
  INFO = 'INFO',
  PASS = 'PASS',
  FAIL = 'FAIL',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private static timestamp(): string {
    return new Date().toISOString();
  }

  static log(level: LogLevel, message: string, data?: any): void {
    const ts = this.timestamp();
    const prefix = `[${ts}] [${level}]`;

    switch (level) {
      case LogLevel.PASS:
        console.log(chalk.green(`${prefix} ✅ ${message}`));
        break;
      case LogLevel.FAIL:
        console.log(chalk.red(`${prefix} ❌ ${message}`));
        if (data) console.log(chalk.red(JSON.stringify(data, null, 2)));
        break;
      case LogLevel.WARN:
        console.log(chalk.yellow(`${prefix} ⚠️ ${message}`));
        break;
      case LogLevel.ERROR:
        console.log(chalk.red(`${prefix} 🔴 ${message}`));
        if (data) console.log(chalk.red(JSON.stringify(data, null, 2)));
        break;
      default:
        console.log(chalk.blue(`${prefix} ℹ️ ${message}`));
    }
  }

  static info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  static pass(message: string): void {
    this.log(LogLevel.PASS, message);
  }

  static fail(message: string, data?: any): void {
    this.log(LogLevel.FAIL, message, data);
  }

  static warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  static error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  static separator(): void {
    console.log(chalk.gray('─'.repeat(60)));
  }

  static header(title: string): void {
    console.log('');
    console.log(chalk.bold.cyan(`╔══ ${title} ══╗`));
    console.log('');
  }
}