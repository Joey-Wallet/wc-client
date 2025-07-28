export interface DebounceOptions {
  leading?: boolean; // Execute immediately on first call
  trailing?: boolean; // Execute after delay (standard debounce)
  maxWait?: number; // Maximum time to wait before execution
  immediate?: boolean; // Alias for leading, for backward compatibility
  cancelOn?: 'none' | 'call' | 'timeout'; // When to cancel pending execution
}

export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void; // Cancel pending execution
  flush: () => ReturnType<T> | undefined; // Execute immediately if pending
  pending: () => boolean; // Check if there's a pending execution
};

/**
 * Creates a debounced version of a function with advanced options
 * @param fn The function to debounce
 * @param wait Debounce delay in milliseconds
 * @param options Configuration options
 * @returns Debounced function with control methods
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> => {
  const {
    leading = false,
    trailing = true,
    maxWait = Infinity,
    immediate = leading, // Support both immediate and leading
    cancelOn = 'call',
  } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let maxTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;
  let lastCallTime: number | null = null;

  // Core execution function
  const execute = (): ReturnType<T> | undefined => {
    if (lastArgs === null) return undefined;

    const args = lastArgs;
    const thisArg = lastThis;

    clearTimeouts();
    lastArgs = null;
    lastThis = null;
    lastCallTime = null;

    result = fn.apply(thisArg, args);
    return result;
  };

  // Clear all timeouts
  const clearTimeouts = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = null;
    }
  };

  // Main debounced function
  const debounced = function (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const currentTime = Date.now();
    const isFirstCall = lastCallTime === null;
    lastArgs = args;
    lastThis = this;
    lastCallTime = currentTime;

    // Handle cancelOn behavior
    if (cancelOn === 'call' && timeoutId) {
      clearTimeouts();
    }

    // Leading/immediate execution
    if ((immediate || leading) && isFirstCall) {
      return execute();
    }

    // Set up trailing execution
    if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (!leading || !isFirstCall) {
          execute();
        }
      }, wait);
    }

    // Set up maxWait execution
    if (maxWait !== Infinity && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        maxTimeoutId = null;
        execute();
      }, maxWait);
    }

    return result;
  };

  // Cancel pending execution
  debounced.cancel = (): void => {
    clearTimeouts();
    lastArgs = null;
    lastThis = null;
    lastCallTime = null;
  };

  // Flush pending execution immediately
  debounced.flush = (): ReturnType<T> | undefined => {
    if (timeoutId || maxTimeoutId) {
      return execute();
    }
    return result;
  };

  // Check if there's a pending execution
  debounced.pending = (): boolean => {
    return timeoutId !== null || maxTimeoutId !== null;
  };

  return debounced;
};
