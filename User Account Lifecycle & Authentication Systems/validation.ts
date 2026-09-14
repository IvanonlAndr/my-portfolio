type ValidationResult = { valid: boolean; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
  if (!email) return { valid: false, message: 'Email is required.' };
  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, message: 'Enter a valid email address.' };
  }
  return { valid: true, message: '' };
}

export function validatePassword(password: string): ValidationResult {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: 'Password needs an uppercase letter and a number.' };
  }
  return { valid: true, message: '' };
}

export function getPasswordStrength(password: string) {
  const checks = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Contains an uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Contains a number', passed: /[0-9]/.test(password) },
    { label: 'Contains a symbol', passed: /[^A-Za-z0-9]/.test(password) }
  ];
  const passedCount = checks.filter((c) => c.passed).length;
  const percentage = Math.round((passedCount / checks.length) * 100);
  return { checks, percentage };
}
