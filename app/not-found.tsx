import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-col px-5 py-16">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-5xl">That page isn’t here.</h1>
      <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
        The quiz is still the whole product.
      </p>
      <Link href="/" className="cta mt-8 w-full sm:w-auto">
        Back home
      </Link>
    </section>
  );
}
