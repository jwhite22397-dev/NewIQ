import type { ReactNode } from "react";

export function LegalPage({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-8 sm:py-14">
      <p className="eyebrow">NewIQ</p>
      <h1 className="display mt-4 text-4xl text-balance sm:text-5xl">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{lede}</p>
      <div className="legal-copy mt-8">{children}</div>
    </article>
  );
}
