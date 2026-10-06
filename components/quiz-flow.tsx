"use client";

import { useEffect, useRef } from "react";
import {
  QUIZ_STEPS,
  getChoicesForStep,
  selectedChoiceId,
  type QuizStepId,
} from "@/data/questions";
import type { QuizAnswers } from "@/lib/types";

interface QuizFlowProps {
  stepIndex: number;
  answers: Partial<QuizAnswers>;
  onSelect: (stepId: QuizStepId, choiceId: string) => void;
  onBack: () => void;
}

export function QuizFlow({ stepIndex, answers, onSelect, onBack }: QuizFlowProps) {
  const step = QUIZ_STEPS[stepIndex];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const choices = step ? getChoicesForStep(step.id, answers) : [];
  const selected = step ? selectedChoiceId(step.id, answers) : undefined;
  const progress = QUIZ_STEPS.length === 0 ? 0 : ((stepIndex + 1) / QUIZ_STEPS.length) * 100;

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  if (!step) return null;

  return (
    <section className="rise-in mx-auto flex w-full max-w-lg flex-col px-5 py-6 sm:py-10" aria-labelledby="quiz-question">
      <div className="flex items-center justify-between gap-4">
        {stepIndex > 0 ? (
          <button type="button" className="text-link" onClick={onBack}>
            Back
          </button>
        ) : (
          <span className="text-sm text-[var(--faint)]">Private · on this device</span>
        )}
        <p className="text-sm font-semibold tracking-[0.14em] text-[var(--muted)]">
          {stepIndex + 1} / {QUIZ_STEPS.length}
        </p>
      </div>
      <div
        className="progress-track mt-4"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={QUIZ_STEPS.length}
        aria-valuenow={stepIndex + 1}
        aria-label="Quiz progress"
      >
        <div className="progress-value" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-8">
        <h1
          id="quiz-question"
          ref={headingRef}
          tabIndex={-1}
          className="display text-4xl text-balance outline-none sm:text-5xl"
        >
          {step.prompt}
        </h1>
        <p className="mt-4 text-lg leading-7 text-[var(--muted)]">{step.supporting}</p>
        <div role="group" aria-labelledby="quiz-question" className="mt-6 grid gap-3">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="answer-card pressable"
              aria-pressed={selected === choice.id}
              onClick={() => onSelect(step.id, choice.id)}
            >
              <span>{choice.label}</span>
              <small>{choice.hint}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
