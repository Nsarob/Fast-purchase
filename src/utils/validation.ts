export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must include at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProductName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 100;
};

export const validateProductDescription = (description: string): boolean => {
  return description.trim().length >= 10;
};

export const validatePrice = (price: number): boolean => {
  return price > 0;
};

export const validateStock = (stock: number): boolean => {
  return stock >= 0 && Number.isInteger(stock);
};
