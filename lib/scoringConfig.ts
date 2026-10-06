/**
 * Tune recommendation behavior here. The engine reads these weights and
 * does not hard-code them in React components.
 */
export const scoringConfig = {
  /** Multiplier for the selected vibe trait. */
  vibeWeight: 5,
  /** Added to the vibe trait when adventurousness is "keep it familiar". */
  familiarBoost: 2,
  /** Multiplier for the "what matters most" trait. */
  focusWeight: 4,
  /** Multiplier for question-4 refinement weights. */
  refinementScale: 1,
  /**
   * "Something slightly different" picks the runner-up when its score is at
   * least this fraction of the leader. Otherwise it stays with the leader.
   */
  adjacentScoreRatio: 0.75,
  /** "Surprise me" chooses among this many top-ranked categories. */
  surprisePoolSize: 3,
} as const;
