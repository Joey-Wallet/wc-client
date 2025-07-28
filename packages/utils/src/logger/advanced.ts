export type TVerbose = boolean | 'silent' | 'error' | 'warn' | 'info' | 'debug';

export class Logger {
  private verboseLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug';

  constructor(opts: { verbose: TVerbose }) {
    // Handle boolean for backward compatibility
    if (typeof opts.verbose === 'boolean') {
      this.verboseLevel = opts.verbose ? 'info' : 'silent';
    } else {
      // Map 'suppress' to 'silent' and fix typo 'waring' to 'warn'
      this.verboseLevel = opts.verbose;
    }
  }

  // Helper method to create timestamp
  private _getTimestamp = () => Date.now().toString();

  private _logWithTimestamp = (level: string, ...args: unknown[]) => {
    const timestamp = this._getTimestamp();
    console.log(`[${timestamp}] [${level}]`, ...args);
  };

  // Define log level priorities
  private _shouldLog = (logLevel: 'error' | 'warn' | 'info' | 'success' | 'debug') => {
    const levels = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
    const successLevel = 3; // Treat 'success' as 'info' level
    const currentLevel = levels[this.verboseLevel] || 0;
    const messageLevel = logLevel === 'success' ? successLevel : levels[logLevel] || 3;
    return currentLevel >= messageLevel;
  };

  error = (...args: unknown[]) =>
    this._shouldLog('error') && this._logWithTimestamp('ERROR', ...args);
  warn = (...args: unknown[]) => this._shouldLog('warn') && this._logWithTimestamp('WARN', ...args);
  info = (...args: unknown[]) => this._shouldLog('info') && this._logWithTimestamp('INFO', ...args);
  success = (...args: unknown[]) =>
    this._shouldLog('success') && this._logWithTimestamp('SUCCESS', ...args);
  debug = (...args: unknown[]) =>
    this._shouldLog('debug') && this._logWithTimestamp('DEBUG', ...args);

  obj = {
    error: (obj: unknown) => this._shouldLog('error') && this._logWithTimestamp('ERROR', obj),
    warn: (obj: unknown) => this._shouldLog('warn') && this._logWithTimestamp('WARN', obj),
    info: (obj: unknown) => this._shouldLog('info') && this._logWithTimestamp('INFO', obj),
    success: (obj: unknown) => this._shouldLog('success') && this._logWithTimestamp('SUCCESS', obj),
    debug: (obj: unknown) => this._shouldLog('debug') && this._logWithTimestamp('DEBUG', obj),
  };
}
