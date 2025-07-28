export interface TTrampolineOptions {
  maxIterations?: number; // Maximum number of iterations to prevent infinite loops
  stopOnValue?: boolean; // Stop when a specific value type is returned
  debug?: boolean; // Enable debug logging
}

// Trampoline function with generic type and options
// Recursion function with a stopper
export const trampoline = <T>(fn: () => T | (() => T), options: TTrampolineOptions = {}): T => {
  const { maxIterations = Infinity, stopOnValue = false, debug = false } = options;

  let result: T | (() => T) = fn();
  let iterations = 0;

  while (typeof result === 'function') {
    // Check maximum iterations
    if (iterations >= maxIterations) {
      throw new Error(`Maximum iterations (${maxIterations}) exceeded in trampoline`);
    }

    // Execute the thunk
    result = (result as () => T)();
    iterations++;

    // Debug logging
    if (debug) {
      console.log(`Iteration ${iterations}:`, typeof result === 'function' ? 'Function' : result);
    }

    // Early termination if stopOnValue is true and we get a non-function
    if (stopOnValue && typeof result !== 'function') {
      break;
    }
  }

  // Ensure the final result is not a function
  if (typeof result === 'function') {
    throw new Error('Trampoline terminated with a function instead of a value');
  }

  return result;
};

// Enhanced factorial function with stop marker
export const factorial = (n: number, acc: number = 1, stopImmediately: boolean = false) => {
  // Immediate stop condition
  if (stopImmediately) return acc;

  // Base case
  if (n <= 0) return acc;

  // Return thunk for next iteration
  return () => factorial(n - 1, acc * n);
};
