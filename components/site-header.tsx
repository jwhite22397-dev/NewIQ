"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/wordmark";

export function SiteHeader() {
  const pathname = usePathname();
  const showStart = pathname !== "/quiz";

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5">
      <Link href="/" aria-label="NewIQ home" className="rounded-full">
        <Wordmark />
      </Link>
      <div className="flex items-center gap-3">
        <p className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold tracking-[0.14em] text-[var(--muted)]">
          18+
        </p>
        {showStart ? (
          <Link href="/quiz" className="cta hidden min-h-11 px-5 text-sm sm:inline-flex">
            Find My Match
          </Link>
        ) : null}
      </div>
    </header>
  );
}
