import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validateRequired,
} from '../utils/validators';

describe('validateEmail', () => {
  it('rejects empty input', () => {
    expect(validateEmail('')).toMatch(/required/i);
  });
  it('rejects a malformed address', () => {
    expect(validateEmail('not-an-email')).toMatch(/valid/i);
  });
  it('accepts a well-formed address', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('requires at least 5 characters, matching the backend rule', () => {
    expect(validatePassword('abcd')).not.toBeNull();
    expect(validatePassword('abcde')).toBeNull();
  });
});

describe('validateName', () => {
  it('requires at least 5 characters, matching the backend rule', () => {
    expect(validateName('Jo')).not.toBeNull();
    expect(validateName('Jo Doe')).toBeNull();
  });
});

describe('validateConfirmPassword', () => {
  it('flags a mismatch', () => {
    expect(validateConfirmPassword('secret1', 'secret2')).not.toBeNull();
  });
  it('passes on an exact match', () => {
    expect(validateConfirmPassword('secret1', 'secret1')).toBeNull();
  });
});

describe('validateRequired', () => {
  it('flags blank values with the given label', () => {
    expect(validateRequired('   ', 'Address')).toMatch(/Address is required/);
  });
});
