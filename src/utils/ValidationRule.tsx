export const ValidationRule = {
  password: {
    presence: false,
    length: {
      minimum: 10,
      message: "must be at least 10 number",
    },
  },
  oldPassword: {
    presence: false,
    length: {
      minimum: 10,
      message: "must be at least 10 number",
    },
  },
  newPassword: {
    presence: false,
    length: {
      minimum: 10,
      message: "must be at least 10 number",
    },
  },
  confirmPassword: {
    equality: "newPassword",
  },
}
