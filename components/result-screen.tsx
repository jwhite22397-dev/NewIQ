import { AdSlot } from "@/components/ad-slot";
import type { Category } from "@/lib/types";

interface ResultScreenProps {
  category: Category;
  url: string | null;
  providerLabel: string;
  canRequestAnother: boolean;
  onAnother: () => void;
  onRestart: () => void;
  onOpen: () => void;
}

export function ResultScreen({
  category,
  url,
  providerLabel,
  canRequestAnother,
  onAnother,
  onRestart,
  onOpen,
}: ResultScreenProps) {
  return (
    <section className="rise-in mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8 sm:py-14" aria-labelledby="result-title">
      <p className="eyebrow">Your match</p>
      <AdSlot placement="result-bridge" />
      <div>
        <p className="text-lg text-[var(--muted)]">We think you’ll like</p>
        <h1 id="result-title" className="display mt-3 text-5xl text-balance sm:text-6xl">
          {category.label}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          Based on what you’re in the mood for, this looks like your best match.
        </p>
        <p className="mt-3 leading-7 text-[var(--ink)]">{category.blurb}</p>
      </div>

      <div className="grid gap-3">
        {url ? (
          <a href={url} rel="noopener noreferrer" className="cta pressable" onClick={onOpen}>
            Show Me
          </a>
        ) : (
          <p className="surface px-4 py-4 leading-7 text-[var(--muted)]">
            We couldn’t prepare a verified link. Try the questions again.
          </p>
        )}
        <p className="text-sm leading-6 text-[var(--faint)]">
          {url
            ? `Opens a ${providerLabel} page. NewIQ doesn’t host that content.`
            : "Only allowlisted categories can leave this site."}
        </p>
        <button type="button" className="cta-secondary pressable" onClick={onRestart}>
          Try Again
        </button>
        {canRequestAnother ? (
          <button type="button" className="cta-secondary pressable" onClick={onAnother}>
            Give Me Another
          </button>
        ) : null}
      </div>
      <AdSlot placement="result" />
    </section>
  );
}
