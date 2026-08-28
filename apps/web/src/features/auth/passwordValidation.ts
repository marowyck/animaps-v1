export type PasswordRuleId = "minLength" | "uppercase" | "special";

export type PasswordRuleResult = {
  id: PasswordRuleId;
  ok: boolean;
};

const SPECIAL_RE = /[^A-Za-z0-9]/;
const UPPERCASE_RE = /[A-Z]/;
export const PASSWORD_MIN_LENGTH = 8;

export function checkPasswordRules(password: string): PasswordRuleResult[] {
  return [
    { id: "minLength", ok: password.length >= PASSWORD_MIN_LENGTH },
    { id: "uppercase", ok: UPPERCASE_RE.test(password) },
    { id: "special", ok: SPECIAL_RE.test(password) },
  ];
}

export function isStrongPassword(password: string): boolean {
  return checkPasswordRules(password).every((rule) => rule.ok);
}

export type PasswordFormErrorKey =
  | "passwordWeak"
  | "passwordMismatch"
  | "passwordRequired";

export function validatePasswordStep(
  password: string,
  confirmPassword: string,
): PasswordFormErrorKey | null {
  if (!password.trim() || !confirmPassword.trim()) {
    return "passwordRequired";
  }
  if (!isStrongPassword(password)) {
    return "passwordWeak";
  }
  if (password !== confirmPassword) {
    return "passwordMismatch";
  }
  return null;
}
