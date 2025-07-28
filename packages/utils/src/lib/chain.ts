export const compose = <T>(...functions: ((x: T) => T)[]) => {
  return (input: T) => functions.reduceRight((acc, fn) => fn(acc), input);
};

export const pipe = <T>(...functions: ((x: T) => T)[]) => {
  return (input: T) => functions.reduce((acc, fn) => fn(acc), input);
};
