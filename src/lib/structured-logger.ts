/**
 * Structured Logging System
 * 
 * Provides consistent, searchable logs across the application
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  scope?: string;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * Structured Logger Class
 */
class StructuredLogger {
  private scope: string;
  private isProduction: boolean;

  constructor(scope: string = 'App') {
    this.scope = scope;
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      scope: this.scope,
    };

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        message: error.message,
        stack: this.isProduction ? undefined : error.stack,
        code: (error as any).code,
      };
    }

    return entry;
  }

  private output(entry: LogEntry) {
    const logString = JSON.stringify(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        if (!this.isProduction) {
          console.debug(logString);
        }
        break;
      case LogLevel.INFO:
        console.info(logString);
        break;
      case LogLevel.WARN:
        console.warn(logString);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logString);
        break;
    }
  }

  debug(message: string, context?: LogContext) {
    this.output(this.formatLog(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: LogContext) {
    this.output(this.formatLog(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext) {
    this.output(this.formatLog(LogLevel.WARN, message, context));
  }

  error(message: string, contextOrError?: LogContext | Error, error?: Error) {
    const isErrorFirst = contextOrError instanceof Error;
    const actualError = isErrorFirst ? contextOrError : error;
    const actualContext = isErrorFirst ? undefined : contextOrError;

    this.output(this.formatLog(LogLevel.ERROR, message, actualContext, actualError));
  }

  fatal(message: string, contextOrError?: LogContext | Error, error?: Error) {
    const isErrorFirst = contextOrError instanceof Error;
    const actualError = isErrorFirst ? contextOrError : error;
    const actualContext = isErrorFirst ? undefined : contextOrError;

    this.output(this.formatLog(LogLevel.FATAL, message, actualContext, actualError));
  }

  /**
   * Create child logger with extended scope
   */
  child(childScope: string): StructuredLogger {
    return new StructuredLogger(`${this.scope}:${childScope}`);
  }
}

/**
 * Create scoped logger
 */
export function createLogger(scope: string = 'App'): StructuredLogger {
  return new StructuredLogger(scope);
}

/**
 * Default app logger
 */
export const logger = createLogger('App');

