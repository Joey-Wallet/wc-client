export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

/**
 * Converts string to PascalCase
 * @param str - Input string to convert
 * @returns PascalCase formatted string
 */
export const toPascalCase = (str: string) => {
  return str
    .replace(/(\w)(\w*)/g, (_, first, rest) => first.toUpperCase() + rest.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Truncates a string with ellipsis in the middle
 * @param fullString - Input string to truncate
 * @param string_length - Maximum length of output string
 * @returns Truncated string with ellipsis in the middle
 */
export const truncate = (fullString: string, string_length: number) => {
  if (fullString.length <= string_length) {
    return fullString;
  }

  const separator = '...';
  const separator_length = separator.length;
  const charsToShow = string_length - separator_length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    fullString.slice(0, frontChars) + separator + fullString.slice(fullString.length - backChars)
  );
};

/**
 * Capitalizes the first letter of a string
 * @param str - Input string to capitalize
 * @returns String with first letter capitalized
 */
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Removes all whitespace from a string
 * @param str - Input string to clean
 * @returns String without whitespace
 */
export const removeWhitespace = (str: string) => str.replace(/\s+/g, '');

/**
 * Reverses a string
 * @param str - Input string to reverse
 * @returns Reversed string
 */
export const reverseString = (str: string) => str.split('').reverse().join('');

/**
 * Counts occurrences of a substring in a string
 * @param str - String to search
 * @param substring - Substring to count
 * @returns Number of occurrences
 */
export const countOccurrences = (str: string, substring: string) => {
  const escaped = substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (str.match(new RegExp(escaped, 'g')) || []).length;
};

/**
 * Checks if string is a palindrome
 * @param str - String to check
 * @returns True if string is same forwards and backwards
 */
export const isPalindrome = (str: string) => {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === reverseString(clean);
};

/**
 * Trims string to specified length and adds ellipsis if truncated
 * @param str - Input string
 * @param maxLength - Maximum allowed length
 * @returns Trimmed string with ellipsis if needed
 */
export const trimToLength = (str: string, maxLength: number) => {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

/**
 * Splits camelCase string into words
 * @param str - camelCase string to split
 * @returns Space-separated words
 */
export const splitCamelCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
};

/**
 * Truncates a string with ellipsis in the middle
 * @param str - The string to truncate
 * @param char - Number of characters to keep at start/end (default: 6)
 * @returns Formatted string with ellipsis in middle
 * @throws {TypeError} If input is not a string
 */
export const ellipse = (str: string, char?: number) => {
  if (typeof str !== 'string') throw new TypeError('Input must be a string');
  const length = char ?? 6;
  if (length < 1) throw new RangeError('Character length must be at least 1');

  return `${str.slice(0, length)}...${str.slice(-length)}`;
};

export const checks = {
  /**
   * Validates UUID v4 format
   * @param input - String to validate
   * @returns True if valid UUID v4 format
   * @throws {TypeError} If input is not a string
   */
  isValidUUID: (input: string) => {
    if (typeof input !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input);
  },

  /**
   * Validates URL format with HTTPS protocol
   * @param input - String to validate
   * @returns True if valid HTTPS URL format
   * @throws {TypeError} If input is not a string
   */
  isValidURL: (input: string) => {
    if (typeof input !== 'string') return false;
    try {
      const url = new URL(input);
      return url.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Validates numeric amount format (positive numbers with optional decimal places)
   * @param input - String to validate
   * @returns True if valid amount format (0 < amount <= 15 decimal places)
   */
  isValidAmount: (input: string) => {
    return /^(?!0+$)(?!0*\.0*$)\d+(\.\d{1,15})?$/.test(input);
  },

  /**
   * Validates SHA-256 hash format (64-character hex string)
   * @param input - String to validate
   * @returns True if valid hash format
   * @throws {TypeError} If input is not a string
   */
  isValidHash: (input: string) => {
    if (typeof input !== 'string') return false;
    return /^[a-f0-9]{64}$/i.test(input);
  },
};

export const sanitize = (input: string) => {
  // Trim whitespace from start and end
  let sanitized: string = input.trim();

  // Remove any HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Define entity map with explicit types
  const entityMap: { [key: string]: string } = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": "'",
    '’': "'",
    '/': '/',
    ' ': ' ',
  };

  // Replace HTML entities
  sanitized = sanitized.replace(
    /&(?:amp|lt|gt|quot|#39|#x27|#x2F|nbsp);/g,
    (match: string): string => entityMap[match] || match
  );

  // Prevent XSS by escaping special characters if they're still present
  sanitized = sanitized.replace(/[<>"'`]/g, (char: string): string => {
    return {
      '<': '<',
      '>': '>',
      '"': '"',
      "'": "'",
      '`': '`',
    }[char] as string;
  });

  // Remove control characters (ASCII 0-31 except tab, line break, carriage return)
  sanitized = sanitized
    // Basic ASCII controls (0-8)
    // .replace(/[\u0000-\u0008]/g, '')
    // Vertical tab and form feed
    // .replace(/[\u000B\u000C]/g, '')
    // Remaining C0 controls (14-31)
    // .replace(/[\u000E-\u001F]/g, '')
    // DEL and C1 controls (127-159)
    .replace(/[\u007F-\u009F]/g, '')
    // Zero-width spaces and RTL/LTR marks
    .replace(/[\u200B-\u200F]/g, '')
    // Line/paragraph separators and special spaces
    .replace(/[\u2028-\u202F]/g, '')
    // Formatting spaces
    .replace(/[\u205F-\u206F]/g, '')
    // Byte Order Mark
    .replace(/\uFEFF/g, '');

  // Normalize unicode characters and remove any remaining unusual characters
  sanitized = sanitized.normalize('NFKD').replace(/[^\w\s.-]/g, '');

  return sanitized;
};
