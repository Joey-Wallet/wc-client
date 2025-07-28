import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

const tailwindMergeConfig = {
  // ↓ Set how many values should be stored in cache.
  cacheSize: 500,
};

const customTwMerge = extendTailwindMerge(tailwindMergeConfig);

export default (...inputs: ClassValue[]) => {
  return customTwMerge(clsx(inputs));
};
