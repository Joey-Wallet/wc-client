import * as sign from './signTransaction';
import * as signFor from './signTransactionFor';
import * as signBatch from './signTransactionBatch';

export { sign, signFor, signBatch };

export const signTransaction = sign.default;
export const signTransactionFor = signFor.default;

// Joey Specific Methods
export const signTransactionBatch = signBatch.default;
