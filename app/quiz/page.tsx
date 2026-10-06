import type { Metadata } from "next";
import { QuizLoader } from "@/components/quiz-loader";

export const metadata: Metadata = {
  title: "Find your match",
  description: "Five quick questions for a private, adults-only recommendation.",
};

export default function QuizPage() {
  return <QuizLoader />;
}
