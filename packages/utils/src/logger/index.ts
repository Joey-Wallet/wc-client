export class Logger {
  isLogger = false;
  constructor(opts: { verbose: boolean }) {
    this.isLogger = opts.verbose;
  }

  // Helper method to create timestamp
  private _getTimestamp = () => Date.now().toString();

  private _logWithTimestamp = (level: string, ...args: unknown[]) => {
    const timestamp = this._getTimestamp();
    console.log(`[${timestamp}] [${level}]`, ...args);
  };

  error = (...args: unknown[]) => this._logWithTimestamp('ERROR', ...args);
  warn = (...args: unknown[]) => this.isLogger && this._logWithTimestamp('WARN', ...args);
  info = (...args: unknown[]) => this.isLogger && this._logWithTimestamp('INFO', ...args);
  success = (...args: unknown[]) => this.isLogger && this._logWithTimestamp('SUCCESS', ...args);

  obj = {
    error: (obj: unknown) => this._logWithTimestamp('ERROR', obj),
    warn: (obj: unknown) => this.isLogger && this._logWithTimestamp('WARN', obj),
    info: (obj: unknown) => this.isLogger && this._logWithTimestamp('INFO', obj),
    success: (obj: unknown) => this.isLogger && this._logWithTimestamp('SUCCESS', obj),
  };
}
