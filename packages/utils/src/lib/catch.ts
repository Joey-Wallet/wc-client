// Types for the result object with discriminated union
export type TSuccess<T> = {
  data: T;
  error: null;
};

export type TFailure<TError> = {
  data: null;
  error: TError;
};

export type TResult<T, TError = Error> = TSuccess<T> | TFailure<TError>;

// 1. Promise-specific wrapper
/**
 * Wraps a Promise in a try-catch and returns a Result
 * @param promise The Promise to execute
 * @returns Promise<Result> with either data or error
 */
export const promiseCatch = async <T, TError = Error>(
  promise: Promise<T>
): Promise<TResult<T, TError>> => {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as TError };
  }
};

// 2. Synchronous function wrapper
/**
 * Wraps a synchronous function in a try-catch and returns a Result
 * @param fn Synchronous function to execute
 * @returns Result with either data or error
 */
export const tryCatch = <T, TError = Error>(fn: () => T): TResult<T, TError> => {
  try {
    const data = fn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as TError };
  }
};

// 3. Generic async function wrapper (not limited to Promises)
/**
 * Wraps an async function (Promise-returning or not) in a try-catch
 * @param fn Async function that may return a Promise or value
 * @returns Promise<Result> with either data or error
 */
export const asyncCatch = <T, TError = Error>(
  fn: () => T | Promise<T>
): Promise<TResult<T, TError>> => {
  try {
    const result = fn();

    // If it's a Promise, handle it asynchronously
    if (result instanceof Promise) {
      return result
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error: error as TError }));
    }

    // If it's not a Promise, return synchronously wrapped in Promise
    return Promise.resolve({ data: result, error: null });
  } catch (error) {
    return Promise.resolve({ data: null, error: error as TError });
  }
};

export const safeAsync = <T, TArgs extends any[], TError = Error>(
  fn: (...args: TArgs) => T | Promise<T>
): ((...args: TArgs) => Promise<TResult<T, TError>>) => {
  return async (...args: TArgs): Promise<TResult<T, TError>> => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result
          .then((data) => ({ data, error: null }))
          .catch((error) => ({ data: null, error: error as TError }));
      }
      return Promise.resolve({ data: result, error: null });
    } catch (error) {
      return Promise.resolve({ data: null, error: error as TError });
    }
  };
};
