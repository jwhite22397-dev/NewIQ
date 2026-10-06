/** Local-only age confirmation. This value is never sent to a server. */
export const AGE_CONFIRMATION_KEY = "newiq.ageConfirmed";

const AGE_CONFIRMATION_VALUE = "yes";

export function hasAgeConfirmation(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AGE_CONFIRMATION_KEY) === AGE_CONFIRMATION_VALUE;
  } catch {
    return false;
  }
}

export function setAgeConfirmation(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AGE_CONFIRMATION_KEY, AGE_CONFIRMATION_VALUE);
  } catch {
    // Private mode can block storage. The current visit can still continue.
  }
}
