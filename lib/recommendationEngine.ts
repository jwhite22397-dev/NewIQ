import { CATEGORIES } from "@/data/categories";
import { scoringConfig } from "@/lib/scoringConfig";
import { getFallbackCategory, isAllowedCategory } from "@/lib/safety";
import {
  FOCUS_TO_TRAIT,
  TRAIT_KEYS,
  VIBE_TO_TRAIT,
  isAdventure,
  isAudience,
  isFocus,
  isVibe,
  type AdventureId,
  type AudienceId,
  type Category,
  type PreferenceProfile,
} from "@/lib/types";

export interface RankedCategory {
  id: string;
  score: number;
  category: Category;
}

export interface Recommendation {
  category: Category;
  ranked: RankedCategory[];
  usedFallback: boolean;
}

export interface RecommendOptions {
  /** Injected so "Surprise me" stays deterministic in tests. */
  random?: () => number;
}

function defaultRandom(): number {
  return Math.random();
}

export function normalizeProfile(profile: PreferenceProfile): PreferenceProfile | null {
  if (!isAudience(profile.audience)) return null;
  return {
    audience: profile.audience,
    vibe: isVibe(profile.vibe) ? profile.vibe : "surprise",
    focus: isFocus(profile.focus) ? profile.focus : "none",
    adventure: isAdventure(profile.adventure) ? profile.adventure : "familiar",
    refinementWeights: profile.refinementWeights ?? {},
  };
}

export function scoreCategory(category: Category, profile: PreferenceProfile): number {
  let score = 0;

  if (profile.vibe !== "surprise") {
    const trait = VIBE_TO_TRAIT[profile.vibe];
    const value = category.traits[trait];
    score += value * scoringConfig.vibeWeight;
    if (profile.adventure === "familiar") {
      score += value * scoringConfig.familiarBoost;
    }
  }

  if (profile.focus !== "none") {
    const trait = FOCUS_TO_TRAIT[profile.focus];
    score += category.traits[trait] * scoringConfig.focusWeight;
  }

  for (const key of TRAIT_KEYS) {
    const weight = profile.refinementWeights[key] ?? 0;
    if (weight !== 0) {
      score += category.traits[key] * weight * scoringConfig.refinementScale;
    }
  }

  return score;
}

export function rankCategories(profile: PreferenceProfile): RankedCategory[] {
  const normalized = normalizeProfile(profile);
  if (!normalized) return [];

  return CATEGORIES.filter((category) => category.audiences.includes(normalized.audience))
    .map((category) => ({
      id: category.id,
      score: scoreCategory(category, normalized),
      category,
    }))
    .sort((a, b) => b.score - a.score || a.category.tieBreak - b.category.tieBreak);
}

export function chooseFromRanking<T extends { score: number }>(
  ranked: readonly T[],
  adventure: AdventureId,
  random: () => number = defaultRandom,
): T | null {
  if (ranked.length === 0) return null;

  if (adventure === "surprise") {
    const poolSize = Math.min(scoringConfig.surprisePoolSize, ranked.length);
    const roll = random();
    const safeRoll = Number.isFinite(roll) ? roll : 0;
    const index = Math.min(poolSize - 1, Math.max(0, Math.floor(safeRoll * poolSize)));
    return ranked[index] ?? ranked[0];
  }

  if (adventure === "adjacent" && ranked.length > 1) {
    const leader = ranked[0].score;
    const runnerUp = ranked[1].score;
    if (leader <= 0 || runnerUp / leader >= scoringConfig.adjacentScoreRatio) {
      return ranked[1];
    }
  }

  return ranked[0];
}

/**
 * The next recommendation is the highest remaining score.
 * It does not roll again, even if the first pick used "Surprise me".
 */
export function nextAlternative(
  ranked: readonly RankedCategory[],
  shownIds: readonly string[],
): RankedCategory | null {
  const shown = new Set(shownIds);
  return ranked.find((item) => !shown.has(item.id)) ?? null;
}

function fallbackRecommendation(audience: AudienceId, ranked: RankedCategory[]): Recommendation {
  return {
    category: getFallbackCategory(audience),
    ranked,
    usedFallback: true,
  };
}

export function recommend(
  profile: PreferenceProfile,
  options: RecommendOptions = {},
): Recommendation {
  const normalized = normalizeProfile(profile);
  if (!normalized) {
    return fallbackRecommendation("straight", []);
  }

  const ranked = rankCategories(normalized);
  const selected = chooseFromRanking(
    ranked,
    normalized.adventure,
    options.random ?? defaultRandom,
  );

  if (!selected || !isAllowedCategory(selected.category.slug)) {
    return fallbackRecommendation(normalized.audience, ranked);
  }

  return {
    category: selected.category,
    ranked,
    usedFallback: false,
  };
}
