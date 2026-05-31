export const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const passwordRules = [
  {
    label: "At least 10 characters",
    test: (password: string) => password.length >= 10,
  },
  {
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password: string) => /\d/.test(password),
  },
  {
    label: "One special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

export const validatePassword = (password: string) => {
  return passwordRules.every((rule) => rule.test(password));
};
