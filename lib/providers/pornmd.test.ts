import { CATEGORIES } from "@/data/categories";
import {
  VERIFIED_PORNMD_URLS,
  assemblePornMdUrl,
  buildPornMdUrl,
} from "@/lib/providers/pornmd";
import { isAllowedCategory } from "@/lib/safety";
import { AUDIENCES, type AudienceId } from "@/lib/types";
import { describe, expect, it } from "vitest";

const ATTACKS = [
  "teen",
  "amateur-teen",
  "step-mom",
  "stepmom",
  "incest",
  "rape",
  "forced",
  "non-consensual",
  "underage",
  "lolita",
  "child",
  "bestiality",
  "jailbait",
  "../admin",
  "amateur/../../etc",
  "https://evil.example",
  "amateur?orientation=gay",
  "amateur#fragment",
  "amateur gay",
  "",
  " ",
  "AMATEUR",
  "trans/straight",
  "%2e%2e",
  "massage&orientation=straight",
  "not-a-real-category",
];

function expectSafeUrl(url: string | null, audience: AudienceId) {
  expect(url).toBeTruthy();
  const parsed = new URL(url!);
  expect(parsed.origin).toBe("https://www.pornmd.com");
  expect(parsed.pathname.startsWith("/c/")).toBe(true);
  const slug = decodeURIComponent(parsed.pathname.slice("/c/".length));
  expect(isAllowedCategory(slug)).toBe(true);
  expect(parsed.pathname).toBe(`/c/${slug}`);

  const orientation = parsed.searchParams.get("orientation");
  const expectedOrientation = {
    straight: new URL(VERIFIED_PORNMD_URLS.straightAmateur).searchParams.get("orientation"),
    gay: new URL(VERIFIED_PORNMD_URLS.gayMassage).searchParams.get("orientation"),
    trans: new URL(VERIFIED_PORNMD_URLS.transCategory).searchParams.get("orientation"),
  }[audience];
  expect(orientation).toBe(expectedOrientation);
  if (audience === "straight") expect(parsed.search).toBe("");
  expect([...parsed.searchParams.keys()].filter((key) => key !== "orientation")).toEqual([]);
  return slug;
}

describe("PornMD URL generation", () => {
  it("reproduces the verified category URLs", () => {
    expect(buildPornMdUrl({ category: "amateur", audience: "straight" })).toBe(
      VERIFIED_PORNMD_URLS.straightAmateur,
    );
    expect(buildPornMdUrl({ category: "massage", audience: "gay" })).toBe(
      VERIFIED_PORNMD_URLS.gayMassage,
    );
    expect(buildPornMdUrl({ category: "trans", audience: "trans" })).toBe(
      VERIFIED_PORNMD_URLS.transCategory,
    );
  });

  it("encodes the slug and keeps the origin fixed", () => {
    const url = assemblePornMdUrl("real-amateur", null);
    expect(url).toBe("https://www.pornmd.com/c/real-amateur");
  });

  it("refuses to assemble an unknown or prohibited slug", () => {
    expect(assemblePornMdUrl("teen", null)).toBeNull();
    expect(assemblePornMdUrl("not-real", "gay")).toBeNull();
    expect(assemblePornMdUrl("amateur", "gay&evil=1")).toBeNull();
    expect(assemblePornMdUrl("amateur", "../gay")).toBeNull();
    expect(assemblePornMdUrl("amateur", "Gay")).toBeNull();
  });

  it("falls back instead of building a URL from an arbitrary category", () => {
    for (const attack of ATTACKS) {
      for (const audience of AUDIENCES) {
        const slug = expectSafeUrl(buildPornMdUrl({ category: attack, audience }), audience);
        expect(decodeURIComponent(slug)).not.toBe(attack);
      }
    }
  });

  it("does not send a straight visitor to a trans-only category", () => {
    expect(buildPornMdUrl({ category: "trans", audience: "straight" })).toBe(
      VERIFIED_PORNMD_URLS.straightAmateur,
    );
  });

  it("does not send other audiences to women-only categories", () => {
    expect(buildPornMdUrl({ category: "lesbian-massage", audience: "gay" })).toBe(
      VERIFIED_PORNMD_URLS.gayMassage,
    );
    expect(buildPornMdUrl({ category: "milf", audience: "trans" })).toBe(
      VERIFIED_PORNMD_URLS.transCategory,
    );
  });

  it("drops an invalid audience instead of copying it into the query", () => {
    const url = buildPornMdUrl({ category: "amateur", audience: "gay?evil=1" });
    expect(url).toBe(VERIFIED_PORNMD_URLS.straightAmateur);
    expect(url).not.toContain("evil");
  });

  it("only links allowlisted slugs for real categories", () => {
    for (const category of CATEGORIES) {
      for (const audience of category.audiences) {
        const slug = expectSafeUrl(
          buildPornMdUrl({ category: category.slug, audience }),
          audience,
        );
        expect(slug).toBe(category.slug);
      }
    }
  });
});
