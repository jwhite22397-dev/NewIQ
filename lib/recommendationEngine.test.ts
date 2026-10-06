import { getRefinementById } from "@/data/questions";
import { scoringConfig } from "@/lib/scoringConfig";
import {
  chooseFromRanking,
  nextAlternative,
  rankCategories,
  recommend,
  scoreCategory,
} from "@/lib/recommendationEngine";
import type { PreferenceProfile } from "@/lib/types";
import { describe, expect, it } from "vitest";

function profile(overrides: Partial<PreferenceProfile> = {}): PreferenceProfile {
  return {
    audience: "straight",
    vibe: "passionate",
    focus: "scenario",
    adventure: "familiar",
    refinementWeights: {},
    ...overrides,
  };
}

describe("recommendation scoring", () => {
  it("ranks a passionate, scenario-led straight profile to sensual massage", () => {
    const result = recommend(profile());
    expect(result.usedFallback).toBe(false);
    expect(result.category.id).toBe("lesbian-massage");
    expect(result.ranked[0]?.id).toBe("lesbian-massage");
  });

  it("keeps gay recommendations inside the gay audience", () => {
    const result = recommend(
      profile({ audience: "gay", vibe: "passionate", focus: "scenario" }),
    );
    expect(result.category.id).toBe("massage");
    expect(result.ranked.every((item) => item.category.audiences.includes("gay"))).toBe(true);
    expect(result.ranked.map((item) => item.id)).not.toContain("lesbian-massage");
    expect(result.ranked.map((item) => item.id)).not.toContain("milf");
  });

  it("uses the broad trans category when performers and polish matter", () => {
    const result = recommend(
      profile({ audience: "trans", vibe: "polished", focus: "performers" }),
    );
    expect(result.category.id).toBe("trans");
  });

  it("prefers mature women for a polished, performer-led straight profile", () => {
    const result = recommend(
      profile({ vibe: "polished", focus: "performers", adventure: "familiar" }),
    );
    expect(result.category.id).toBe("milf");
  });

  it("prefers power exchange for an intense, activity-led familiar profile", () => {
    const result = recommend(
      profile({ vibe: "intense", focus: "activity", adventure: "familiar" }),
    );
    expect(result.category.id).toBe("bdsm");
  });

  it("steps to a nearby category when the runner-up is close", () => {
    const result = recommend(
      profile({ vibe: "intense", focus: "activity", adventure: "adjacent" }),
    );
    expect(result.category.id).toBe("amateur-threesome");
  });

  it("lets a first-person refinement outrank the generic amateur match", () => {
    const weights = getRefinementById("first-person")?.weights;
    expect(weights).toBeTruthy();
    const result = recommend(
      profile({
        vibe: "casual",
        focus: "none",
        adventure: "familiar",
        refinementWeights: weights,
      }),
    );
    expect(result.category.id).toBe("amateur-pov");
  });

  it("scores only eligible traits for the selected vibe and focus", () => {
    const casual = recommend(
      profile({ vibe: "casual", focus: "none", adventure: "familiar", refinementWeights: {} }),
    );
    expect(casual.category.id).toBe("amateur");
    const ranked = rankCategories(
      profile({ vibe: "casual", focus: "none", adventure: "familiar" }),
    );
    expect(ranked[0]?.score).toBeGreaterThan(ranked[1]?.score ?? 0);
  });

  it("ignores vibe weight when the vibe answer is surprise", () => {
    const withVibe = scoreCategory(
      rankCategories(profile({ vibe: "casual", focus: "none" }))[0]!.category,
      profile({ vibe: "casual", focus: "none", adventure: "adjacent" }),
    );
    const surprised = scoreCategory(
      rankCategories(profile({ vibe: "casual", focus: "none" }))[0]!.category,
      profile({ vibe: "surprise", focus: "none", adventure: "adjacent" }),
    );
    expect(withVibe).toBeGreaterThan(0);
    expect(surprised).toBe(0);
  });
});

describe("surprise me and alternatives", () => {
  const intense = profile({
    vibe: "intense",
    focus: "activity",
    adventure: "surprise",
    refinementWeights: {},
  });

  it("picks inside the top pool instead of the whole catalog", () => {
    const first = recommend(intense, { random: () => 0 });
    const last = recommend(intense, { random: () => 0.99 });
    const ranked = rankCategories(intense);

    expect(first.category.id).toBe(ranked[0]?.id);
    expect(last.category.id).toBe(ranked[Math.min(2, ranked.length - 1)]?.id);
    expect(last.category.id).not.toBe(ranked.at(-1)?.id);
  });

  it("gives another highly ranked option instead of rolling again", () => {
    const ranked = rankCategories(intense);
    const surprisePick = chooseFromRanking(ranked, "surprise", () => 0.99);
    expect(surprisePick?.id).toBe(ranked[2]?.id);

    const another = nextAlternative(ranked, [surprisePick!.id]);
    expect(another?.id).toBe(ranked[0]?.id);

    const rest = nextAlternative(ranked, [surprisePick!.id, another!.id]);
    expect(rest?.id).toBe(ranked[1]?.id);
    expect(nextAlternative(ranked, ranked.map((item) => item.id))).toBeNull();
  });

  it("keeps adjacent and familiar selection deterministic", () => {
    expect(chooseFromRanking([{ score: 10 }, { score: 9 }, { score: 1 }], "familiar")?.score).toBe(
      10,
    );
    expect(chooseFromRanking([{ score: 10 }, { score: 9 }], "adjacent")?.score).toBe(9);
    expect(
      chooseFromRanking([{ score: 10 }, { score: 10 * scoringConfig.adjacentScoreRatio - 0.1 }], "adjacent")
        ?.score,
    ).toBe(10);
    expect(chooseFromRanking([{ score: 4 }], "adjacent")?.score).toBe(4);
    expect(chooseFromRanking([], "surprise")).toBeNull();
  });
});

describe("fallback behavior", () => {
  it("returns the straight fallback for an unknown audience", () => {
    const result = recommend(profile({ audience: "nope" as PreferenceProfile["audience"] }));
    expect(result.usedFallback).toBe(true);
    expect(result.category.id).toBe("amateur");
    expect(result.ranked).toEqual([]);
  });

  it("does not throw when refinement weights are empty", () => {
    expect(() => recommend(profile({ refinementWeights: {} }))).not.toThrow();
  });
});
