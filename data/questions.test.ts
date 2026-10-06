import {
  ADVENTURES,
  AUDIENCES,
  FOCUSES,
  VIBES,
  type PreferenceProfile,
} from "@/lib/types";
import { recommend } from "@/lib/recommendationEngine";
import { buildPornMdUrl } from "@/lib/providers/pornmd";
import { isAllowedCategory } from "@/lib/safety";
import {
  QUIZ_STEPS,
  applyAnswer,
  getRefinementOptions,
  isCompleteQuiz,
  toPreferenceProfile,
} from "@/data/questions";
import { describe, expect, it } from "vitest";

describe("quiz configuration", () => {
  it("asks no more than five questions", () => {
    expect(QUIZ_STEPS.length).toBeLessThanOrEqual(5);
    expect(QUIZ_STEPS.map((step) => step.id)).toEqual([
      "audience",
      "vibe",
      "focus",
      "refinement",
      "adventure",
    ]);
  });

  it("always offers a short refinement list", () => {
    for (const vibe of VIBES) {
      for (const focus of FOCUSES) {
        const options = getRefinementOptions({ vibe, focus });
        const ids = options.map((option) => option.id);
        expect(options.length).toBeGreaterThanOrEqual(2);
        expect(options.length).toBeLessThanOrEqual(4);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });

  it("drops a refinement that no longer matches earlier answers", () => {
    const cleared = applyAnswer(
      { vibe: "passionate", focus: "scenario", refinementId: "not-real" },
      "vibe",
      "intense",
    );
    expect(cleared.refinementId).toBeUndefined();
    expect(cleared.vibe).toBe("intense");
  });

  it("turns a finished quiz into a profile without inventing a category", () => {
    let answers = {};
    const choices = ["straight", "casual", "visual", "first-person", "familiar"] as const;
    QUIZ_STEPS.forEach((step, index) => {
      answers = applyAnswer(answers, step.id, choices[index]!);
    });
    expect(isCompleteQuiz(answers)).toBe(true);
    if (!isCompleteQuiz(answers)) return;
    const preference = toPreferenceProfile(answers);
    expect(preference.audience).toBe("straight");
    expect(preference.refinementWeights.visual).toBeGreaterThan(0);
    expect(preference).not.toHaveProperty("slug");
  });
});

describe("end-to-end recommendation safety", () => {
  it("never emits an unknown category URL for any answer combination", () => {
    for (const audience of AUDIENCES) {
      for (const vibe of VIBES) {
        for (const focus of FOCUSES) {
          for (const adventure of ADVENTURES) {
            for (const refinement of getRefinementOptions({ vibe, focus })) {
              const preference: PreferenceProfile = {
                audience,
                vibe,
                focus,
                adventure,
                refinementWeights: refinement.weights,
              };
              const result = recommend(preference, { random: () => 0.4 });
              expect(result.category.audiences).toContain(audience);
              expect(isAllowedCategory(result.category.slug)).toBe(true);

              const url = buildPornMdUrl({
                category: result.category.slug,
                audience,
              });
              const parsed = new URL(url!);
              const slug = decodeURIComponent(parsed.pathname.slice("/c/".length));
              expect(parsed.origin).toBe("https://www.pornmd.com");
              expect(isAllowedCategory(slug)).toBe(true);
              expect(slug).not.toMatch(/teen|rape|incest|minor|child|underage/);
            }
          }
        }
      }
    }
  });
});
