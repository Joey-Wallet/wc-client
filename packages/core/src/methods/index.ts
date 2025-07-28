import * as sign from './signTransaction';
import * as signFor from './signTransactionFor';
import * as signFee from './signTransactionFee';
import * as signBatch from './signTransactionBatch';

export { sign, signFor, signFee, signBatch };

export const signTransaction = sign.default;
export const signTransactionFor = signFor.default;

// Joey Specific Methods
export const signTransactionFee = signFee.default;
export const signTransactionBatch = signBatch.default;
