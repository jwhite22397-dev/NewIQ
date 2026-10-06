"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AgeGateProps {
  onConfirm: () => void;
}

export function AgeGate({ onConfirm }: AgeGateProps) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") router.push("/");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <section className="rise-in mx-auto flex w-full max-w-lg flex-col px-5 py-10 sm:py-16" aria-labelledby="age-gate-title">
      <p className="eyebrow">Adults only</p>
      <h1 id="age-gate-title" className="display mt-4 text-5xl text-balance">
        Are you 18 or older?
      </h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
        NewIQ recommends searches for adults. It does not host videos or images, and it does not
        ask for your date of birth.
      </p>
      <div className="mt-8 grid gap-3">
        <button type="button" className="cta pressable" onClick={onConfirm}>
          {"Yes, I'm 18+"}
        </button>
        <Link href="/" className="cta-secondary pressable">
          Exit
        </Link>
      </div>
    </section>
  );
}
