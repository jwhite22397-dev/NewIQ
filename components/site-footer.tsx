import Link from "next/link";

const links = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/content-policy", label: "Content policy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-6xl px-5 py-10">
      <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-[var(--faint)]">
          NewIQ is an adults-only recommendation layer. It does not host videos or images.
          Outbound links open a third-party site.
        </p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[var(--muted)] underline-offset-4 hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
