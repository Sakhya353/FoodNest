import { parsePriceFromOption, formatCurrency } from '../utils/food';

describe('parsePriceFromOption', () => {
  it('extracts the leading number from a size string', () => {
    expect(parsePriceFromOption('220 ml')).toBe(220);
    expect(parsePriceFromOption('130ml')).toBe(130);
  });

  it('returns 0 for a non-numeric value instead of NaN', () => {
    expect(parsePriceFromOption('ml')).toBe(0);
    expect(parsePriceFromOption(undefined)).toBe(0);
  });
});

describe('formatCurrency', () => {
  it('formats a number with the rupee symbol', () => {
    expect(formatCurrency(250)).toBe('₹250');
  });

  it('falls back to 0 for invalid input', () => {
    expect(formatCurrency(undefined)).toBe('₹0');
  });
});
