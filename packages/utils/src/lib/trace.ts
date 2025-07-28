import { Logger } from '~/logger';

export interface TraceOptions {
  logger?: Logger;
  includeTimestamp?: boolean;
  includeStack?: boolean;
  prefix?: string;
  traceErrors?: boolean;
}

/**
 * Creates a traced version of a function with configurable logging, supporting both sync and async functions
 * @param fn The function to trace (sync or async)
 * @param label Name or label for the function in logs
 * @param options Configuration for tracing behavior
 * @returns Traced version of the function, preserving sync/async behavior
 */
export const trace = <T extends (...args: any[]) => any>(
  fn: T,
  label: string = fn.name || 'anonymous',
  options: TraceOptions = {}
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const {
    logger = new Logger({ verbose: false }),
    includeTimestamp = false,
    includeStack = false,
    prefix = '[TRACE]',
    traceErrors = true,
  } = options;

  return function (...args: Parameters<T>): ReturnType<T> {
    const startTime = performance.now();
    const timestamp = includeTimestamp ? new Date().toISOString() : '';
    const stack = includeStack ? new Error().stack?.split('\n').slice(2).join('\n') : '';

    // Log entry
    const entryMessage = `${prefix} ${label} called${timestamp ? ` at ${timestamp}` : ''}`;
    logger.info(entryMessage, { args });
    if (includeStack) logger.info('Stack:', stack);

    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        return result.then(
          (resolved) => {
            const duration = performance.now() - startTime;
            logger.info(`${prefix} ${label} completed in ${duration.toFixed(2)}ms`, {
              result: resolved,
            });
            return resolved;
          },
          (error) => {
            const duration = performance.now() - startTime;
            if (traceErrors) {
              logger.error(`${prefix} ${label} failed after ${duration.toFixed(2)}ms`, {
                error: error instanceof Error ? error.message : String(error),
              });
              if (includeStack)
                logger.error('Error Stack:', error instanceof Error ? error.stack : '');
            }
            throw error;
          }
        ) as ReturnType<T>;
      }

      // Synchronous case
      const duration = performance.now() - startTime;
      logger.info(`${prefix} ${label} completed in ${duration.toFixed(2)}ms`, { result });
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      if (traceErrors) {
        logger.error(`${prefix} ${label} failed after ${duration.toFixed(2)}ms`, {
          error: error instanceof Error ? error.message : String(error),
        });
        if (includeStack) logger.error('Error Stack:', error instanceof Error ? error.stack : '');
      }
      throw error;
    }
  };
};
