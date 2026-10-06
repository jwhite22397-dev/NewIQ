/** Local-only age confirmation. This value is never sent to a server. */
export const AGE_CONFIRMATION_KEY = "newiq.ageConfirmed";

const AGE_CONFIRMATION_VALUE = "yes";

/**
 * In-memory copy so the current visit can continue when storage is blocked,
 * and so the same tab updates immediately. Storage events do not fire in the
 * tab that wrote the value.
 */
let sessionConfirmed = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

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

export function subscribeAgeConfirmation(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Client snapshot. Safe to differ from the server snapshot after hydration. */
export function getAgeConfirmationSnapshot(): boolean {
  return sessionConfirmed || hasAgeConfirmation();
}

/** Matches the server render so the age gate is the first screen. */
export function getAgeConfirmationServerSnapshot(): boolean {
  return false;
}

export function confirmAgeGate(): void {
  sessionConfirmed = true;
  setAgeConfirmation();
  emit();
}
