import { CATEGORIES } from "@/data/categories";
import { AUDIENCES, type AudienceId, type Category } from "@/lib/types";

/**
 * Safe generic category per audience. Each fallback slug is itself allowlisted.
 * - straight: /c/amateur
 * - gay: /c/massage (verified with the gay orientation filter)
 * - trans: /c/trans (verified with PornMD's trans orientation filter)
 */
export const FALLBACK_CATEGORY_ID: Record<AudienceId, string> = {
  straight: "amateur",
  gay: "massage",
  trans: "trans",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Rejected even if a future edit adds them to the taxonomy. Patterns are
 * anchored on hyphen boundaries so ordinary words are not caught by accident.
 */
const PROHIBITED_SLUG_PATTERNS: readonly RegExp[] = [
  /(^|-)teen($|-)/,
  /(^|-)underage($|-)/,
  /(^|-)under-age($|-)/,
  /(^|-)minor($|-)/,
  /(^|-)child(ren)?($|-)/,
  /(^|-)preteen($|-)/,
  /(^|-)lolita($|-)/,
  /(^|-)loli($|-)/,
  /(^|-)jailbait($|-)/,
  /(^|-)pedo($|-)/,
  /(^|-)paedo($|-)/,
  /(^|-)csam($|-)/,
  /(^|-)young($|-)/,
  /(^|-)schoolgirl($|-)/,
  /(^|-)school-girl($|-)/,
  /(^|-)barely-legal($|-)/,
  /(^|-)ageplay($|-)/,
  /(^|-)age-play($|-)/,
  /(^|-)ddlg($|-)/,
  /(^|-)incest($|-)/,
  /(^|-)step(mom|mother|dad|father|son|daughter|sister|brother|family|sis|bro)($|-)/,
  /(^|-)step-(mom|mother|dad|father|son|daughter|sister|brother|family|sis|bro)($|-)/,
  /(^|-)rape($|-)/,
  /(^|-)forced($|-)/,
  /(^|-)non-consensual($|-)/,
  /(^|-)nonconsensual($|-)/,
  /(^|-)drunk($|-)/,
  /(^|-)intoxicated($|-)/,
  /(^|-)unconscious($|-)/,
  /(^|-)kidnap(ping)?($|-)/,
  /(^|-)traffick(ing)?($|-)/,
  /(^|-)bestiality($|-)/,
  /(^|-)zoophilia($|-)/,
  /(^|-)animal($|-)/,
];

const ALLOWED_SLUGS = new Set(CATEGORIES.map((category) => category.slug));

export function isProhibitedSlug(slug: string): boolean {
  const normalized = slug.toLowerCase();
  return PROHIBITED_SLUG_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isAllowedCategory(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && !isProhibitedSlug(slug) && ALLOWED_SLUGS.has(slug);
}

export function getCategoryBySlug(slug: string): Category | null {
  if (!isAllowedCategory(slug)) return null;
  return CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function getCategoryById(id: string): Category | null {
  const category = CATEGORIES.find((item) => item.id === id) ?? null;
  if (!category || !isAllowedCategory(category.slug)) return null;
  return category;
}

export function getFallbackCategory(audience: AudienceId): Category {
  const category = getCategoryById(FALLBACK_CATEGORY_ID[audience]);
  if (!category || !category.audiences.includes(audience)) {
    throw new Error(`Fallback category for ${audience} failed validation.`);
  }
  return category;
}

function assertTaxonomy(): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const category of CATEGORIES) {
    if (ids.has(category.id)) {
      throw new Error(`Duplicate category id: ${category.id}`);
    }
    if (slugs.has(category.slug)) {
      throw new Error(`Duplicate category slug: ${category.slug}`);
    }
    ids.add(category.id);
    slugs.add(category.slug);

    if (!SLUG_PATTERN.test(category.slug) || isProhibitedSlug(category.slug)) {
      throw new Error(`Unsafe category slug: ${category.slug}`);
    }
    if (category.audiences.length === 0) {
      throw new Error(`Category ${category.id} has no audience.`);
    }
  }

  for (const audience of AUDIENCES) {
    const fallback = CATEGORIES.find((category) => category.id === FALLBACK_CATEGORY_ID[audience]);
    if (!fallback || !fallback.audiences.includes(audience) || !isAllowedCategory(fallback.slug)) {
      throw new Error(`Missing safe fallback for ${audience}.`);
    }
  }
}

assertTaxonomy();
