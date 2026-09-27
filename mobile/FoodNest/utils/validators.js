// Kept in sync with the backend's actual validation rules
// (server/Routes/CreateUser.js uses express-validator):
//   email: must be a valid email
//   name: minimum 5 characters
//   password: minimum 5 characters

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim()) ? null : 'Enter a valid email address.';
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  return password.length >= 5 ? null : 'Password must be at least 5 characters.';
}

export function validateName(name) {
  if (!name?.trim()) return 'Name is required.';
  return name.trim().length >= 5 ? null : 'Name must be at least 5 characters.';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.';
  return password === confirmPassword ? null : 'Passwords do not match.';
}

export function validateRequired(value, label) {
  return value?.trim() ? null : `${label} is required.`;
}

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  validateRequired,
};
