export const TRAIT_KEYS = [
  "passionate",
  "intense",
  "casual",
  "polished",
  "performer",
  "scenario",
  "visual",
  "activity",
] as const;

export type TraitKey = (typeof TRAIT_KEYS)[number];

export type TraitVector = Record<TraitKey, number>;

export const AUDIENCES = ["straight", "gay", "trans"] as const;
export type AudienceId = (typeof AUDIENCES)[number];

export const VIBES = ["passionate", "intense", "casual", "polished", "surprise"] as const;
export type VibeId = (typeof VIBES)[number];

export const FOCUSES = ["performers", "scenario", "visual", "activity", "none"] as const;
export type FocusId = (typeof FOCUSES)[number];

export const ADVENTURES = ["familiar", "adjacent", "surprise"] as const;
export type AdventureId = (typeof ADVENTURES)[number];

export const VIBE_TO_TRAIT = {
  passionate: "passionate",
  intense: "intense",
  casual: "casual",
  polished: "polished",
} as const satisfies Record<Exclude<VibeId, "surprise">, TraitKey>;

export const FOCUS_TO_TRAIT = {
  performers: "performer",
  scenario: "scenario",
  visual: "visual",
  activity: "activity",
} as const satisfies Record<Exclude<FocusId, "none">, TraitKey>;

export interface Category {
  id: string;
  label: string;
  slug: string;
  audiences: AudienceId[];
  traits: TraitVector;
  /** Lower values win ties. Keep these unique. */
  tieBreak: number;
  blurb: string;
}

export interface PreferenceProfile {
  audience: AudienceId;
  vibe: VibeId;
  focus: FocusId;
  adventure: AdventureId;
  refinementWeights: Partial<TraitVector>;
}

export interface QuizAnswers {
  audience: AudienceId;
  vibe: VibeId;
  focus: FocusId;
  refinementId: string;
  adventure: AdventureId;
}

function includesValue<T extends string>(values: readonly T[], value: string): value is T {
  return values.some((item) => item === value);
}

export function isAudience(value: string): value is AudienceId {
  return includesValue(AUDIENCES, value);
}

export function isVibe(value: string): value is VibeId {
  return includesValue(VIBES, value);
}

export function isFocus(value: string): value is FocusId {
  return includesValue(FOCUSES, value);
}

export function isAdventure(value: string): value is AdventureId {
  return includesValue(ADVENTURES, value);
}
