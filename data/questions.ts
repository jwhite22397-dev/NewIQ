import {
  isAdventure,
  isAudience,
  isFocus,
  isVibe,
  type AdventureId,
  type AudienceId,
  type FocusId,
  type PreferenceProfile,
  type QuizAnswers,
  type TraitVector,
  type VibeId,
} from "@/lib/types";

export interface AnswerChoice {
  id: string;
  label: string;
  hint: string;
}

export interface RefinementOption extends AnswerChoice {
  weights: Partial<TraitVector>;
  vibes?: VibeId[];
  focuses?: FocusId[];
}

export const QUIZ_STEP_IDS = [
  "audience",
  "vibe",
  "focus",
  "refinement",
  "adventure",
] as const;

export type QuizStepId = (typeof QUIZ_STEP_IDS)[number];

export interface QuizStep {
  id: QuizStepId;
  prompt: string;
  supporting: string;
}

export const QUIZ_STEPS: readonly QuizStep[] = [
  {
    id: "audience",
    prompt: "Who do you want to watch?",
    supporting: "This sets the broad pool. You can change it if you go back.",
  },
  {
    id: "vibe",
    prompt: "What vibe are you after?",
    supporting: "A mood is enough. You don’t need a category name.",
  },
  {
    id: "focus",
    prompt: "What matters most?",
    supporting: "We’ll lean the match toward this, or leave it open.",
  },
  {
    id: "refinement",
    prompt: "How should we narrow it?",
    supporting: "A broad preference, not a long catalog.",
  },
  {
    id: "adventure",
    prompt: "How adventurous do you feel?",
    supporting: "Stay close to the obvious match, or loosen it a little.",
  },
];

if (QUIZ_STEPS.length > 5) {
  throw new Error("The quiz is limited to 5 questions.");
}

export const AUDIENCE_CHOICES: readonly (AnswerChoice & { id: AudienceId })[] = [
  { id: "straight", label: "Women", hint: "Straight-oriented scenes" },
  { id: "gay", label: "Men", hint: "Gay-oriented scenes" },
  { id: "trans", label: "Trans performers", hint: "Trans-oriented scenes" },
];

export const VIBE_CHOICES: readonly (AnswerChoice & { id: VibeId })[] = [
  { id: "passionate", label: "Passionate", hint: "Close, heated, affectionate" },
  { id: "intense", label: "Rough and intense", hint: "Direct, with more edge" },
  { id: "casual", label: "Casual and amateur", hint: "Unscripted and everyday" },
  { id: "polished", label: "Polished", hint: "Produced and cinematic" },
  { id: "surprise", label: "Surprise me", hint: "Skip the vibe and keep going" },
];

export const FOCUS_CHOICES: readonly (AnswerChoice & { id: FocusId })[] = [
  { id: "performers", label: "The performers", hint: "Who is on screen" },
  { id: "scenario", label: "The scenario", hint: "The situation and setup" },
  { id: "visual", label: "The visual style", hint: "How the scene looks" },
  { id: "activity", label: "The activity", hint: "What the scene centers on" },
  { id: "none", label: "No preference", hint: "Decide from the rest" },
];

export const ADVENTURE_CHOICES: readonly (AnswerChoice & { id: AdventureId })[] = [
  { id: "familiar", label: "Keep it familiar", hint: "Stay with the closest match" },
  {
    id: "adjacent",
    label: "Something slightly different",
    hint: "A nearby mood, still in range",
  },
  { id: "surprise", label: "Surprise me", hint: "Pick among the strongest options" },
];

const REFINEMENT_OPTIONS: readonly RefinementOption[] = [
  {
    id: "unscripted",
    label: "Keep it unscripted",
    hint: "Everyday people, little production",
    vibes: ["casual", "surprise"],
    weights: { casual: 2 },
  },
  {
    id: "first-person",
    label: "Put me in the room",
    hint: "A first-person point of view",
    focuses: ["visual", "activity", "none"],
    weights: { visual: 5, casual: 1 },
  },
  {
    id: "real-chemistry",
    label: "Real chemistry",
    hint: "Performers who seem into it",
    focuses: ["performers", "none"],
    weights: { performer: 3, passionate: 2 },
  },
  {
    id: "slow-close",
    label: "Slow and close",
    hint: "Intimate, with less rush",
    vibes: ["passionate", "surprise"],
    weights: { passionate: 3, scenario: 1 },
  },
  {
    id: "clear-setup",
    label: "A clear setup",
    hint: "The situation leads the scene",
    focuses: ["scenario"],
    weights: { scenario: 3, passionate: 1 },
  },
  {
    id: "power-dynamic",
    label: "A power dynamic",
    hint: "Consensual control and intensity",
    vibes: ["intense"],
    focuses: ["scenario", "activity", "none"],
    weights: { intense: 3, scenario: 2 },
  },
  {
    id: "straight-to-it",
    label: "Straight to it",
    hint: "Less story, more action",
    vibes: ["intense", "casual"],
    focuses: ["activity", "none"],
    weights: { activity: 3, intense: 2 },
  },
  {
    id: "cinematic",
    label: "Make it cinematic",
    hint: "Polished light, wardrobe, and pace",
    vibes: ["polished", "passionate"],
    weights: { polished: 3, visual: 2 },
  },
  {
    id: "performer-first",
    label: "Start with the performers",
    hint: "Who is on screen matters most",
    focuses: ["performers"],
    weights: { performer: 4, polished: 1 },
  },
  {
    id: "one-activity",
    label: "One clear activity",
    hint: "The scene centers on one thing",
    focuses: ["activity"],
    weights: { activity: 4 },
  },
  {
    id: "soft-tension",
    label: "Soft tension",
    hint: "Heat without a rush",
    vibes: ["passionate"],
    focuses: ["visual", "scenario"],
    weights: { passionate: 2, visual: 2 },
  },
  {
    id: "group-energy",
    label: "More than a couple",
    hint: "A consensual group scene",
    vibes: ["intense", "casual", "surprise"],
    focuses: ["activity", "scenario", "none"],
    weights: { activity: 4, intense: 1, casual: 1 },
  },
];

const DEFAULT_REFINEMENT_IDS = ["unscripted", "real-chemistry", "cinematic", "straight-to-it"];
const MAX_REFINEMENTS = 4;

function matchesRefinement(
  option: RefinementOption,
  vibe?: VibeId,
  focus?: FocusId,
): boolean {
  if (option.vibes && vibe && vibe !== "surprise" && !option.vibes.includes(vibe)) {
    return false;
  }
  if (option.focuses && focus && focus !== "none" && !option.focuses.includes(focus)) {
    return false;
  }
  return true;
}

export function getRefinementOptions(input: {
  vibe?: VibeId;
  focus?: FocusId;
}): RefinementOption[] {
  const matched = REFINEMENT_OPTIONS.filter((option) =>
    matchesRefinement(option, input.vibe, input.focus),
  );
  const selected = matched.slice(0, MAX_REFINEMENTS);

  for (const id of DEFAULT_REFINEMENT_IDS) {
    if (selected.length >= MAX_REFINEMENTS) break;
    if (selected.some((option) => option.id === id)) continue;
    const fallback = REFINEMENT_OPTIONS.find((option) => option.id === id);
    if (fallback) selected.push(fallback);
  }

  return selected.slice(0, MAX_REFINEMENTS);
}

export function getRefinementById(id: string): RefinementOption | null {
  return REFINEMENT_OPTIONS.find((option) => option.id === id) ?? null;
}

export function getChoicesForStep(
  stepId: QuizStepId,
  answers: Partial<QuizAnswers>,
): readonly AnswerChoice[] {
  switch (stepId) {
    case "audience":
      return AUDIENCE_CHOICES;
    case "vibe":
      return VIBE_CHOICES;
    case "focus":
      return FOCUS_CHOICES;
    case "adventure":
      return ADVENTURE_CHOICES;
    case "refinement":
      return getRefinementOptions({ vibe: answers.vibe, focus: answers.focus });
  }
}

export function selectedChoiceId(
  stepId: QuizStepId,
  answers: Partial<QuizAnswers>,
): string | undefined {
  switch (stepId) {
    case "audience":
      return answers.audience;
    case "vibe":
      return answers.vibe;
    case "focus":
      return answers.focus;
    case "refinement":
      return answers.refinementId;
    case "adventure":
      return answers.adventure;
  }
}

export function applyAnswer(
  answers: Partial<QuizAnswers>,
  stepId: QuizStepId,
  choiceId: string,
): Partial<QuizAnswers> {
  const next: Partial<QuizAnswers> = { ...answers };

  if (stepId === "audience" && isAudience(choiceId)) next.audience = choiceId;
  if (stepId === "vibe" && isVibe(choiceId)) next.vibe = choiceId;
  if (stepId === "focus" && isFocus(choiceId)) next.focus = choiceId;
  if (stepId === "adventure" && isAdventure(choiceId)) next.adventure = choiceId;
  if (stepId === "refinement" && getRefinementById(choiceId)) next.refinementId = choiceId;

  if (stepId === "audience" || stepId === "vibe" || stepId === "focus") {
    if (
      next.refinementId &&
      !getRefinementOptions({ vibe: next.vibe, focus: next.focus }).some(
        (option) => option.id === next.refinementId,
      )
    ) {
      delete next.refinementId;
    }
  }

  return next;
}

export function isCompleteQuiz(answers: Partial<QuizAnswers>): answers is QuizAnswers {
  return Boolean(
    answers.audience &&
      answers.vibe &&
      answers.focus &&
      answers.refinementId &&
      answers.adventure &&
      getRefinementById(answers.refinementId),
  );
}

export function toPreferenceProfile(answers: QuizAnswers): PreferenceProfile {
  return {
    audience: answers.audience,
    vibe: answers.vibe,
    focus: answers.focus,
    adventure: answers.adventure,
    refinementWeights: getRefinementById(answers.refinementId)?.weights ?? {},
  };
}
