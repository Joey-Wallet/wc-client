import BN from 'big.js';

/**
 * Abbreviates a number and adds commas for formatting
 * @param value - The number string to format
 * @returns Formatted string with commas and abbreviation suffix
 */
export const abbreviateNumber = (value?: string) => addCommas(abbreviate(value));

/**
 * Adds commas to a number string, handling both raw values and pre-abbreviated values
 * @param opts - Configuration object containing value and handling state
 * @returns Number string with proper comma separation
 */
export const addCommas = (opts?: {
  value: string;
  handled?: {
    parsed: string;
    decimal: string;
    suffix: string;
  };
}) => {
  if (!opts?.value) return '';

  const { handled } = opts;
  if (handled) {
    const withCommas = handled.parsed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${withCommas}${handled.decimal}${handled.suffix}`;
  }

  const parts = opts.value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

/**
 * Core abbreviation function that handles numbers from 1e-18 to 1e18
 * @param value - The number string to abbreviate
 * @returns Object containing formatted value and parsing details
 */
export const abbreviate = (value?: string) => {
  if (!value) return;
  const num = BN(value);
  const absoluteNum = num.abs();

  // Handle micro numbers (less than 1)
  if (absoluteNum.lt(1)) {
    const microSuffixes = ['m', 'μ', 'n', 'p', 'f', 'a'];
    const exponents = [3, 6, 9, 12, 15, 18]; // 10^-3 to 10^-18

    for (let i = 0; i < microSuffixes.length; i++) {
      const divisor = BN(10).pow(-exponents[i]);
      if (absoluteNum.gte(divisor)) {
        const formatted = num.times(BN(10).pow(exponents[i])).toFixed(6);
        const [integer, decimal] = formatted.split('.');
        return {
          value: `${integer}.${decimal.slice(0, 2)}${microSuffixes[i]}`,
          handled: {
            parsed: integer,
            decimal: `.${decimal.slice(0, 2)}`,
            suffix: microSuffixes[i],
          },
        };
      }
    }
    return { value: '0' };
  }

  // Handle standard numbers
  const whole = value.split('.')[0];
  if (whole.length < 4) return { value: num.toFixed(6) };

  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Qt'];
  let suffixIndex = 0;
  let divisor = 1;

  if (whole.length > 18) {
    suffixIndex = 6;
    divisor = 1e18;
  } else if (whole.length > 15) {
    suffixIndex = 5;
    divisor = 1e15;
  } else if (whole.length > 12) {
    suffixIndex = 4;
    divisor = 1e12;
  } else if (whole.length > 9) {
    suffixIndex = 3;
    divisor = 1e9;
  } else if (whole.length > 6) {
    suffixIndex = 2;
    divisor = 1e6;
  } else if (whole.length > 3) {
    suffixIndex = 1;
    divisor = 1e3;
  }

  const suffix = suffixes[suffixIndex];
  const abbreviatedValue = num.div(divisor);
  const [integerPart, decimalPart] = abbreviatedValue.toFixed(6).split('.');

  return {
    value: `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${decimalPart ? `.${decimalPart.slice(0, 2)}` : ''}${suffix}`,
    handled: {
      parsed: integerPart,
      decimal: decimalPart ? `.${decimalPart.slice(0, 2)}` : '',
      suffix,
    },
  };
};

/**
 * Abbreviates number to milli units (thousandths)
 * @param value - Input number string
 * @param precision - Decimal places (default: 3)
 * @returns Value formatted in milli units
 */
export const abbreviateToMilli = (value?: string, precision: number = 3) => {
  if (!value) return;
  const num = BN(value).times(1e3);
  return num.gt(0) ? num.toFixed(precision) + 'm' : '0m';
};

/**
 * Abbreviates number to micro units (millionths)
 * @param value - Input number string
 * @param precision - Decimal places (default: 3)
 * @returns Value formatted in micro units
 */
export const abbreviateToMicro = (value?: string, precision: number = 3) => {
  if (!value) return;
  const num = BN(value).times(1e6);
  return num.gt(0) ? num.toFixed(precision) + 'μ' : '0μ';
};

/**
 * Abbreviates number to thousands with configurable precision
 * @param value - Input number string
 * @param decimalPlaces - Decimal places (default: 1)
 * @returns Value formatted in thousands
 */
export const abbreviateToThousands = (value?: string, decimalPlaces: number = 1) => {
  if (!value) return;
  const num = BN(value).div(1e3);
  return num.gt(0) ? num.toFixed(decimalPlaces) + 'K' : '0K';
};

/**
 * Abbreviates number to millions with configurable precision
 * @param value - Input number string
 * @param decimalPlaces - Decimal places (default: 2)
 * @returns Value formatted in millions
 */
export const abbreviateToMillions = (value?: string, decimalPlaces: number = 2) => {
  if (!value) return;
  const num = BN(value).div(1e6);
  return num.gt(0) ? num.toFixed(decimalPlaces) + 'M' : '0M';
};

/**
 * Abbreviates number to billions with configurable precision
 * @param value - Input number string
 * @param decimalPlaces - Decimal places (default: 2)
 * @returns Value formatted in billions
 */
export const abbreviateToBillions = (value?: string, decimalPlaces: number = 2) => {
  if (!value) return;
  const num = BN(value).div(1e9);
  return num.gt(0) ? num.toFixed(decimalPlaces) + 'B' : '0B';
};

/**
 * Parses abbreviated numbers with SI suffixes
 * @param value - Abbreviated string (e.g., "1.5μ")
 * @returns BN object representing the full numeric value
 */
export const parseAbbreviation = (value: string): BN => {
  const match = value.match(/([0-9,.]+)([μmnKMBTQ]t?)?/i);
  if (!match) return BN(0);

  const number = BN(match[1].replace(/,/g, ''));
  const suffix = match[2].toUpperCase();

  const multipliers: { [key: string]: BN } = {
    // SI prefixes (negative exponents)
    m: BN(1e-3), // milli
    μ: BN(1e-6), // micro (Greek mu)
    u: BN(1e-6), // micro (ASCII alternative)
    n: BN(1e-9), // nano
    p: BN(1e-12), // pico
    f: BN(1e-15), // femto
    a: BN(1e-18), // atto

    // SI prefixes (positive exponents)
    k: BN(1e3), // kilo (lowercase)
    K: BN(1e3), // kilo (non-standard uppercase)
    M: BN(1e6), // mega
    G: BN(1e9), // giga
    T: BN(1e12), // tera
    P: BN(1e15), // peta
    E: BN(1e18), // exa

    // Common financial abbreviations
    B: BN(1e9), // billion (US)
    Q: BN(1e15), // quadrillion (US)
    Qt: BN(1e18), // quintillion (US)
  };

  // Handle special case for trillion (US vs SI)
  if (suffix === 'T' && value.toUpperCase().includes('QT')) {
    return number.times(1e18);
  }

  return number.times(multipliers[suffix]);
};

/**
 * Formats numbers in scientific notation
 * @param value - Numeric string value
 * @param precision - Significant figures (default: 4)
 * @returns Formatted scientific notation string
 */
export const formatScientific = (value: string, precision: number = 4): string => {
  const num = BN(value);
  if (num.eq(0)) return '0';

  const exponent = num.e;
  const coefficient = num.div(BN(10).pow(exponent)).toPrecision(precision);
  return `${coefficient}e${exponent}`;
};

/**
 * Formats numbers with appropriate SI units
 * @param value - Input number string
 * @param precision - Decimal places (default: 2)
 * @returns Human-readable string with SI unit
 */
export const formatSIUnits = (value: string, precision: number = 2): string => {
  const num = BN(value);
  if (num.eq(0)) return '0';

  const si = [
    { value: 1e18, symbol: 'E' }, // exa
    { value: 1e15, symbol: 'P' }, // peta
    { value: 1e12, symbol: 'T' }, // tera
    { value: 1e9, symbol: 'G' }, // giga
    { value: 1e6, symbol: 'M' }, // mega
    { value: 1e3, symbol: 'k' }, // kilo
    { value: 1, symbol: '' }, // base unit
    { value: 1e-3, symbol: 'm' }, // milli
    { value: 1e-6, symbol: 'μ' }, // micro
    { value: 1e-9, symbol: 'n' }, // nano
    { value: 1e-12, symbol: 'p' }, // pico
    { value: 1e-15, symbol: 'f' }, // femto
    { value: 1e-18, symbol: 'a' }, // atto
  ];

  const absNum = num.abs();
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  for (const { value: divisor, symbol } of si) {
    if (absNum.gte(divisor)) {
      return `${num.div(divisor).toFixed(precision).replace(rx, '$1')}${symbol}`;
    }
  }
  return num.toFixed(precision);
};

/**
 * Formats currency values with abbreviation
 * @param value - Numeric string value
 * @param currencySymbol - Currency symbol (default: "$")
 * @param negativeFormat - Negative number format (default: parentheses)
 * @returns Formatted currency string
 */
export const formatCurrencyAbbreviation = (
  value: string,
  currencySymbol: string = '$',
  negativeFormat: 'parentheses' | 'minus' = 'parentheses'
): string => {
  const num = BN(value);
  if (num.eq(0)) return `${currencySymbol}0`;

  const isNegative = num.lt(0);
  const absoluteValue = num.abs().toString();
  const abbreviated = abbreviateNumber(absoluteValue);

  const formatted = `${currencySymbol}${abbreviated}`;
  if (isNegative) {
    return negativeFormat === 'parentheses' ? `(${formatted})` : `-${formatted}`;
  }
  return formatted;
};

/**
 * Abbreviates currency values with customizable formatting options
 * @param value - Numeric string value
 * @param options - Configuration options for currency formatting
 * @returns Formatted currency string
 */
export const abbreviateCurrency = (
  value: string,
  options: {
    currencySymbol?: string; // Currency symbol (default: "$")
    separator?: string; // Thousands separator (default: ",")
    useSeparator?: boolean; // Toggle separator usage (default: true)
    fixedLength?: number; // Fixed output length (pads with zeros)
    precision?: number; // Decimal places (default: 2)
    negativeFormat?: 'parentheses' | 'minus'; // Negative number format (default: parentheses)
  } = {}
): string => {
  const {
    currencySymbol = '$',
    separator = ',',
    useSeparator = true,
    fixedLength,
    precision = 2,
    negativeFormat = 'parentheses',
  } = options;

  if (!value) return `${currencySymbol}0`;

  const num = BN(value);
  const isNegative = num.lt(0);
  const absoluteNum = num.abs();

  // Handle zero case
  if (absoluteNum.eq(0)) {
    let zeroResult = `${currencySymbol}0`;
    if (precision > 0) {
      zeroResult += `.${'0'.repeat(precision)}`;
    }
    if (fixedLength) {
      zeroResult = zeroResult.padEnd(fixedLength, '0');
    }
    return zeroResult;
  }

  // Determine abbreviation level
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Qt'];
  const divisors = [1, 1e3, 1e6, 1e9, 1e12, 1e15, 1e18];
  let suffixIndex = 0;

  for (let i = divisors.length - 1; i >= 0; i--) {
    if (absoluteNum.gte(divisors[i])) {
      suffixIndex = i;
      break;
    }
  }

  // Calculate abbreviated value
  const abbreviatedValue = absoluteNum.div(divisors[suffixIndex]);
  let formattedNumber = abbreviatedValue.toFixed(precision);

  // Apply separator if requested
  if (useSeparator) {
    const [integer, decimal] = formattedNumber.split('.');
    const separatedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    formattedNumber = decimal ? `${separatedInteger}.${decimal}` : separatedInteger;
  }

  // Construct base result
  let result = `${currencySymbol}${formattedNumber}${suffixes[suffixIndex]}`;

  // Apply fixed length if specified
  if (fixedLength && result.length < fixedLength) {
    const paddingNeeded = fixedLength - result.length;
    if (precision > 0) {
      const [integerPart, decimalPart = ''] = result.split('.');
      const newDecimal = (decimalPart + '0'.repeat(paddingNeeded)).slice(0, precision);
      result = `${integerPart}.${newDecimal}${suffixes[suffixIndex]}`;
    }
    // Pad remaining length with zeros after suffix if needed
    result = result.padEnd(fixedLength, '0');
  }

  // Apply negative formatting
  if (isNegative) {
    return negativeFormat === 'parentheses' ? `(${result})` : `-${result}`;
  }

  return result;
};

/**
 * Converts numbers to human-readable words
 * @param value - Input number string
 * @param precision - Significant figures (default: 3)
 * @returns Human-readable string with units
 */
export const humanizeNumber = (value: string, precision: number = 3): string => {
  const num = BN(value);
  if (num.eq(0)) return 'Zero';

  const units = [
    { value: 1e24, name: 'Septillion' }, // 10^24
    { value: 1e21, name: 'Sextillion' }, // 10^21
    { value: 1e18, name: 'Quintillion' }, // 10^18
    { value: 1e15, name: 'Quadrillion' }, // 10^15
    { value: 1e12, name: 'Trillion' }, // 10^12
    { value: 1e9, name: 'Billion' }, // 10^9
    { value: 1e6, name: 'Million' }, // 10^6
    { value: 1e3, name: 'Thousand' }, // 10^3
    { value: 1, name: '' }, // Base
    { value: 1e-3, name: 'Thousandth' }, // 10^-3
    { value: 1e-6, name: 'Millionth' }, // 10^-6
    { value: 1e-9, name: 'Billionth' }, // 10^-9
    { value: 1e-12, name: 'Trillionth' }, // 10^-12
    { value: 1e-15, name: 'Quadrillionth' }, // 10^-15
    { value: 1e-18, name: 'Quintillionth' }, // 10^-18
  ];

  const absNum = num.abs();
  for (const unit of units) {
    if (absNum.gte(unit.value)) {
      return `${num.div(unit.value).toPrecision(precision)} ${unit.name}`;
    }
  }
  return num.toPrecision(precision);
};

/**
 * Formats percentage values
 * @param value - Numeric string value
 * @param precision - Decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: string, precision: number = 2): string => {
  const num = BN(value).times(100);
  return `${num.toFixed(precision)}%`;
};

/**
 * Formats numbers with localized separators
 * @param value - Numeric string value
 * @param locale - Locale string (default: 'en-US')
 * @returns Locale-formatted number string
 */
export const formatLocalized = (value: string, locale: string = 'en-US'): string => {
  const num = parseFloat(value);
  return new Intl.NumberFormat(locale).format(num);
};
