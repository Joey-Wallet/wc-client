/**
 * Pauses execution for a specified duration
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after given duration
 * @example
 * await sleep(1000); // Wait 1 second
 */
export const sleep = async (ms: number) => {
  await new Promise<true>((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
};

/**
 * Synchronous sleep that blocks the event loop (use cautiously)
 * @param ms - Milliseconds to sleep
 * @example
 * sleepSync(500); // Block thread for 500ms
 */
export const sleepSync = (ms: number) => {
  const start = Date.now();
  while (Date.now() - start < ms) {}
};

/**
 * Sleep with progress updates
 * @param ms - Total sleep duration
 * @param interval - Callback interval in milliseconds
 * @param callback - Progress callback function
 * @example
 * await sleepWithProgress(1000, 100, (remaining) => {
 *   console.log(`${remaining}ms remaining`);
 * });
 */
export const sleepWithProgress = async (
  ms: number,
  interval: number,
  callback: (remaining: number) => void
) => {
  let remaining = ms;
  while (remaining > 0) {
    await sleep(Math.min(interval, remaining));
    remaining -= interval;
    callback(remaining > 0 ? remaining : 0);
  }
};

/**
 * Sleep until a condition is met or timeout occurs
 * @param check - Condition checking function
 * @param options - Configuration options
 * @returns Promise with boolean (true if condition met, false if timed out)
 */
export const sleepUntil = async (
  check: () => boolean,
  options: { interval?: number; timeout?: number; timeoutMessage?: string } = {}
) => {
  const { interval = 100, timeout = 5000 } = options;
  const start = Date.now();

  return new Promise<boolean>((resolve, reject) => {
    const checkCondition = () => {
      if (check()) {
        resolve(true);
      } else if (Date.now() - start >= timeout) {
        reject(options.timeoutMessage ?? false);
      } else {
        setTimeout(checkCondition, interval);
      }
    };

    checkCondition();
  });
};
