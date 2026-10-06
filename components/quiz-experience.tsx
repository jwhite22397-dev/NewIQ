"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AgeGate } from "@/components/age-gate";
import { QuizFlow } from "@/components/quiz-flow";
import { ResultScreen } from "@/components/result-screen";
import {
  QUIZ_STEPS,
  applyAnswer,
  isCompleteQuiz,
  toPreferenceProfile,
  type QuizStepId,
} from "@/data/questions";
import {
  confirmAgeGate,
  getAgeConfirmationServerSnapshot,
  getAgeConfirmationSnapshot,
  subscribeAgeConfirmation,
} from "@/lib/ageGate";
import { trackEvent } from "@/lib/analytics";
import { nextAlternative, recommend, type Recommendation } from "@/lib/recommendationEngine";
import { activeProvider } from "@/lib/providers";
import type { QuizAnswers } from "@/lib/types";

type Phase = "quiz" | "result";

export function QuizExperience() {
  const confirmed = useSyncExternalStore(
    subscribeAgeConfirmation,
    getAgeConfirmationSnapshot,
    getAgeConfirmationServerSnapshot,
  );
  const [phase, setPhase] = useState<Phase>("quiz");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [shownIds, setShownIds] = useState<string[]>([]);
  const trackedInitialStart = useRef(false);

  useEffect(() => {
    if (trackedInitialStart.current || !confirmed) return;
    trackedInitialStart.current = true;
    trackEvent("quiz_started");
  }, [confirmed]);

  function confirmAge() {
    confirmAgeGate();
  }

  function finish(nextAnswers: QuizAnswers) {
    const result = recommend(toPreferenceProfile(nextAnswers));
    setRecommendation(result);
    setCurrentId(result.category.id);
    setShownIds([result.category.id]);
    setPhase("result");
    trackEvent("quiz_completed");
  }

  function selectAnswer(stepId: QuizStepId, choiceId: string) {
    const nextAnswers = applyAnswer(answers, stepId, choiceId);
    setAnswers(nextAnswers);
    if (stepIndex < QUIZ_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    if (isCompleteQuiz(nextAnswers)) finish(nextAnswers);
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
    setRecommendation(null);
    setCurrentId(null);
    setShownIds([]);
    setPhase("quiz");
    trackEvent("quiz_started");
  }

  function giveAnother() {
    if (!recommendation) return;
    const next = nextAlternative(recommendation.ranked, shownIds);
    if (!next) return;
    setCurrentId(next.id);
    setShownIds((current) => [...current, next.id]);
  }

  if (!confirmed) {
    return <AgeGate onConfirm={confirmAge} />;
  }

  if (phase === "result" && recommendation) {
    const current =
      recommendation.ranked.find((item) => item.id === currentId)?.category ??
      recommendation.category;
    const url = activeProvider.buildUrl({
      category: current.slug,
      audience: answers.audience ?? "straight",
    });

    return (
      <ResultScreen
        category={current}
        url={url}
        providerLabel={activeProvider.label}
        canRequestAnother={nextAlternative(recommendation.ranked, shownIds) !== null}
        onAnother={giveAnother}
        onRestart={restart}
        onOpen={() => trackEvent("external_search_clicked")}
      />
    );
  }

  return (
    <QuizFlow
      stepIndex={stepIndex}
      answers={answers}
      onSelect={selectAnswer}
      onBack={() => setStepIndex((current) => Math.max(0, current - 1))}
    />
  );
}
