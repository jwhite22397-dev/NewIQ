import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";

const steps = [
  {
    title: "Confirm you’re 18+",
    copy: "A simple yes or exit. No date of birth, no account.",
  },
  {
    title: "Answer five questions",
    copy: "Mood and preference, one screen at a time. About half a minute.",
  },
  {
    title: "Open a matching search",
    copy: "We point you to a third-party category page. We don’t play the video.",
  },
];

export function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 pb-8 pt-6 sm:pt-12">
      <section className="max-w-3xl">
        <p className="eyebrow">Adults 18+ · Private by design</p>
        <h1 className="display mt-5 text-5xl text-balance sm:text-7xl">
          Stop searching.
          <span className="mt-2 block italic text-[var(--accent)]">Start finding.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
          Answer 5 quick questions and we’ll point you in the right direction.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-4 sm:items-start">
          <Link href="/quiz" className="cta pressable w-full sm:w-auto">
            Find My Match
          </Link>
          <p className="text-sm font-semibold tracking-wide text-[var(--muted)]">
            5 questions • No account • Private
          </p>
        </div>
        <p className="mt-8 max-w-xl text-sm leading-6 text-[var(--faint)]">
          NewIQ does not host adult content. It helps adults discover a relevant search on a
          third-party site.
        </p>
      </section>

      <section aria-labelledby="how-heading" className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-3">
          <h2 id="how-heading" className="display text-3xl sm:text-4xl">
            Five questions. Then you’re done.
          </h2>
        </div>
        {steps.map((step, index) => (
          <article key={step.title} className="surface p-5">
            <p className="eyebrow">0{index + 1}</p>
            <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 leading-7 text-[var(--muted)]">{step.copy}</p>
          </article>
        ))}
      </section>

      <section aria-label="Advertisement placement" className="max-w-3xl">
        <AdSlot placement="landing" />
      </section>
    </div>
  );
}
