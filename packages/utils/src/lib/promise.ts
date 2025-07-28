import { sleep } from '~/helpers';

export const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  opts: { onTimeout?: () => void; message?: string } = {}
): Promise<T> => {
  let isSettled = false;
  const { onTimeout = undefined, message = 'Promise Timeout' } = opts;

  return Promise.race([
    promise.finally(() => {
      isSettled = true;
    }),
    sleep(ms).then(() => {
      if (isSettled) return;
      onTimeout?.();
      throw new Error(message);
    }),
  ]) as Promise<T>;
};
