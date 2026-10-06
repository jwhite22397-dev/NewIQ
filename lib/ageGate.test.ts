import { describe, expect, it } from "vitest";
import {
  confirmAgeGate,
  getAgeConfirmationServerSnapshot,
  getAgeConfirmationSnapshot,
  hasAgeConfirmation,
} from "@/lib/ageGate";

describe("age gate", () => {
  it("keeps the server render on the confirmation screen", () => {
    expect(getAgeConfirmationServerSnapshot()).toBe(false);
  });

  it("lets the current visit continue when storage is unavailable", () => {
    expect(hasAgeConfirmation()).toBe(false);
    confirmAgeGate();
    expect(getAgeConfirmationSnapshot()).toBe(true);
  });
});
