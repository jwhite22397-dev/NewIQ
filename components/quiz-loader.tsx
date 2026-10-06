"use client";

import dynamic from "next/dynamic";

const QuizExperience = dynamic(
  () => import("@/components/quiz-experience").then((mod) => mod.QuizExperience),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto w-full max-w-lg px-5 py-16" aria-busy="true" aria-live="polite">
        <p className="text-[var(--muted)]">Getting things ready…</p>
      </section>
    ),
  },
);

export function QuizLoader() {
  return <QuizExperience />;
}
