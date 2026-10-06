import { getFallbackCategory, isAllowedCategory, getCategoryBySlug } from "@/lib/safety";
import { isAudience, type AudienceId } from "@/lib/types";

export const PORNMD_ORIGIN = "https://www.pornmd.com";

/**
 * PornMD URL rules, isolated so the rest of the app does not know them.
 *
 * Verified from public category pages (October 2026):
 * - Straight category pages omit an orientation parameter.
 *   Example: https://www.pornmd.com/c/amateur
 * - Gay filter on a category page:
 *   https://www.pornmd.com/c/massage?orientation=gay
 * - Trans filter on a category page uses PornMD's own query value:
 *   https://www.pornmd.com/c/trans?orientation=shemale
 *
 * That trans query value is PornMD's parameter. It is not product copy and
 * must not appear in the interface. Change only this map if PornMD changes
 * routing.
 *
 * Not individually fetched: every allowlisted slug combined with every
 * orientation. The path shape and the query names above are the verified
 * rules. Slugs still have to be on the allowlist.
 *
 * Not used, because it was not verified on current /c/ pages:
 * - orientation=straight
 * - older path-style searches such as /straight/{query}
 * - any free-text search URL
 */
const ORIENTATION_QUERY: Record<AudienceId, string | null> = {
  straight: null,
  gay: "gay",
  trans: "shemale",
};

/** Strings that belong in this adapter only. UI copy is tested against them. */
export const PROVIDER_INTERNAL_TERMS = [ORIENTATION_QUERY.trans].filter(
  (term): term is string => Boolean(term),
);

export const VERIFIED_PORNMD_URLS = {
  straightAmateur: "https://www.pornmd.com/c/amateur",
  gayMassage: "https://www.pornmd.com/c/massage?orientation=gay",
  transCategory: "https://www.pornmd.com/c/trans?orientation=shemale",
} as const;

const ORIENTATION_PATTERN = /^[a-z]+$/;

function resolveSlug(category: string, audience: AudienceId): string {
  const match = getCategoryBySlug(category);
  if (match && match.audiences.includes(audience)) return match.slug;
  return getFallbackCategory(audience).slug;
}

/**
 * Low-level builder. Returns null unless the slug is allowlisted and the
 * orientation value is one of the known tokens. It never interpolates an
 * arbitrary string into the path.
 */
export function assemblePornMdUrl(slug: string, orientation: string | null): string | null {
  if (!isAllowedCategory(slug)) return null;
  if (orientation !== null && !ORIENTATION_PATTERN.test(orientation)) return null;

  const url = new URL(`/c/${encodeURIComponent(slug)}`, PORNMD_ORIGIN);
  if (orientation) {
    url.searchParams.set("orientation", orientation);
  }

  const pathSlug = decodeURIComponent(url.pathname.replace(/^\/c\//, ""));
  if (url.origin !== PORNMD_ORIGIN || pathSlug !== slug || !isAllowedCategory(pathSlug)) {
    return null;
  }

  return url.toString();
}

export function buildPornMdUrl(request: { category: string; audience: string }): string | null {
  if (!isAudience(request.audience)) {
    return assemblePornMdUrl(getFallbackCategory("straight").slug, null);
  }

  const slug = resolveSlug(request.category, request.audience);
  return assemblePornMdUrl(slug, ORIENTATION_QUERY[request.audience]);
}
