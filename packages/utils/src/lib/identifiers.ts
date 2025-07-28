/**
 * Generates a RFC4122 compliant UUID version 4 string
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * Where x is any hex digit and y is 8, 9, A, or B
 */
export const uuid = () => {
  let id = '';
  let ii: number;

  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        id += '-';
        id += ((Math.random() * 16) | 0).toString(16); // Random hex digit
        break;
      case 12:
        id += '-';
        id += '4'; // Version 4 identifier per RFC spec
        break;
      case 16:
        id += '-';
        id += ((Math.random() * 4) | 8).toString(16); // Variant bits (8, 9, A, or B)
        break;
      default:
        id += ((Math.random() * 16) | 0).toString(16); // Standard random hex digit
    }
  }
  return id;
};

/**
 * Generates a short 8-character alphanumeric ID using base36 encoding
 * Example: '3g7f92jk'
 */
export const shortId = () => {
  return Math.random().toString(36).slice(2, 10);
};

/**
 * Generates a hyphen-separated identifier in format XXXX-XXXX-XXXX
 * Uses base36 encoding and converts to uppercase
 * Example: 'A3F9-4GK2-71MN'
 */
export const hyphenId = () => {
  // Generate enough random characters to cover all segments
  const raw = Math.random().toString(36).slice(2, 14).toUpperCase();

  // Pad with zeros if not enough characters are generated
  const padded = raw.padEnd(12, '0');

  // Split into segments of 4 characters each
  const segments = padded.match(/.{1,4}/g);

  // Ensure we have three segments, if not, something went wrong with the string generation
  if (segments && segments.length === 3) {
    return segments.join('-');
  } else {
    // This should rarely happen, but if it does, we'll use a fallback
    return '0000-0000-0000'; // Or throw an error in more strict scenarios
  }
};

/**
 * Generates a numeric-only identifier with specified length
 * @param length - Desired length of numeric ID (default: 10)
 * Example: '2495836201' (for length=10)
 */
export const numericId = (length = 10) => {
  let result = '';
  while (result.length < length) {
    result += Math.random().toString().slice(2); // Append random numbers without '0.'
  }
  return result.slice(0, length); // Slice to exact length if too long
};
