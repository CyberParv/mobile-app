export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePasswordStrength = (password: string): 'Weak' | 'Medium' | 'Strong' => {
  if (password.length < 8) return 'Weak';
  if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    return 'Strong';
  }
  return 'Medium';
};