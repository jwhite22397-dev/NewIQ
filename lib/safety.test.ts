import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { CATEGORIES } from "@/data/categories";
import {
  ADVENTURE_CHOICES,
  AUDIENCE_CHOICES,
  FOCUS_CHOICES,
  QUIZ_STEPS,
  VIBE_CHOICES,
  getRefinementOptions,
} from "@/data/questions";
import { siteConfig } from "@/lib/site";
import { PROVIDER_INTERNAL_TERMS } from "@/lib/providers/pornmd";
import {
  FALLBACK_CATEGORY_ID,
  getFallbackCategory,
  isAllowedCategory,
  isProhibitedSlug,
} from "@/lib/safety";
import { AUDIENCES } from "@/lib/types";
import { describe, expect, it } from "vitest";

const PROHIBITED_SAMPLES = [
  "teen",
  "amateur-teen",
  "teen-amateur",
  "underage",
  "minor",
  "child",
  "children",
  "lolita",
  "jailbait",
  "young",
  "schoolgirl",
  "barely-legal",
  "ageplay",
  "incest",
  "stepmom",
  "step-mom",
  "step-sister",
  "rape",
  "forced",
  "non-consensual",
  "drunk",
  "unconscious",
  "kidnapping",
  "trafficking",
  "bestiality",
  "animal",
];

describe("category allowlist", () => {
  it("accepts only taxonomy slugs with a safe shape", () => {
    for (const category of CATEGORIES) {
      expect(isAllowedCategory(category.slug)).toBe(true);
      expect(isProhibitedSlug(category.slug)).toBe(false);
    }

    expect(isAllowedCategory("amateur")).toBe(true);
    expect(isAllowedCategory("not-a-category")).toBe(false);
    expect(isAllowedCategory("AMATEUR")).toBe(false);
    expect(isAllowedCategory("amateur?x=1")).toBe(false);
    expect(isAllowedCategory("../amateur")).toBe(false);
    expect(isAllowedCategory("")).toBe(false);
  });

  it("rejects prohibited slug patterns even when they look tidy", () => {
    for (const slug of PROHIBITED_SAMPLES) {
      expect(isProhibitedSlug(slug)).toBe(true);
      expect(isAllowedCategory(slug)).toBe(false);
    }
  });

  it("gives every audience a safe fallback", () => {
    for (const audience of AUDIENCES) {
      const fallback = getFallbackCategory(audience);
      expect(fallback.id).toBe(FALLBACK_CATEGORY_ID[audience]);
      expect(fallback.audiences).toContain(audience);
      expect(isAllowedCategory(fallback.slug)).toBe(true);
    }
  });
});

describe("product copy", () => {
  it("keeps provider-only terms out of the interface and taxonomy", () => {
    const copy = [
      siteConfig.title,
      siteConfig.description,
      ...QUIZ_STEPS.flatMap((step) => [step.prompt, step.supporting]),
      ...[...AUDIENCE_CHOICES, ...VIBE_CHOICES, ...FOCUS_CHOICES, ...ADVENTURE_CHOICES].flatMap(
        (choice) => [choice.label, choice.hint],
      ),
      ...getRefinementOptions({}).flatMap((choice) => [choice.label, choice.hint]),
      ...CATEGORIES.flatMap((category) => [category.label, category.blurb, category.slug]),
    ]
      .join("\n")
      .toLowerCase();

    for (const term of PROVIDER_INTERNAL_TERMS) {
      expect(copy.includes(term.toLowerCase())).toBe(false);
    }
  });

  it("does not place provider-only terms in UI source files", () => {
    const roots = ["app", "components", "data", "lib"].map((dir) => path.join(process.cwd(), dir));
    const allowed = new Set([path.normalize("lib/providers/pornmd.ts")]);
    const offenders: string[] = [];

    function walk(directory: string) {
      for (const entry of readdirSync(directory)) {
        const fullPath = path.join(directory, entry);
        const relative = path.normalize(path.relative(process.cwd(), fullPath));
        if (statSync(fullPath).isDirectory()) {
          walk(fullPath);
          continue;
        }
        if (!/\.(ts|tsx|css|md)$/.test(entry) || allowed.has(relative)) continue;
        const source = readFileSync(fullPath, "utf8").toLowerCase();
        for (const term of PROVIDER_INTERNAL_TERMS) {
          if (source.includes(term.toLowerCase())) offenders.push(relative);
        }
      }
    }

    for (const root of roots) walk(root);
    expect(offenders).toEqual([]);
  });
});
