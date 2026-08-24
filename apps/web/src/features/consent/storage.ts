export const COOKIE_CONSENT_KEY = "animaps_cookie_consent";

export type CookieConsentValue = "accepted" | "rejected";

export function readCookieConsent(): CookieConsentValue | null {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") return stored;
    return null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(value: CookieConsentValue): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
}
