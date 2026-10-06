import type { AudienceId, Category, TraitVector } from "@/lib/types";

/**
 * Allowlisted adult categories.
 *
 * Every slug below was confirmed as a public PornMD category path
 * (https://www.pornmd.com/c/{slug}) via indexed pages. Do not add a slug
 * until that path has been checked. Direct requests from this environment
 * were blocked, so unverified names from the A–Z index are intentionally
 * omitted.
 *
 * Confirmed paths include:
 * /c/amateur, /c/real-amateur, /c/homemade-amateur, /c/amateur-threesome,
 * /c/amateur-pov, /c/bdsm, /c/massage, /c/lesbian, /c/lesbian-massage,
 * /c/lesbian-kissing, /c/lesbian-milf, /c/female-pov, /c/milf, /c/trans
 *
 * Audience routing is NOT done by inventing slugs. Gay and trans filters
 * are applied later by the provider, and only with query values that were
 * observed on live /c/ pages.
 *
 * Excluded on purpose: minors, age-play, non-consent, trafficking,
 * family/incest themes, and other illegal material. Those must never be
 * added here. lib/safety.ts also rejects prohibited slug patterns.
 */

const ALL: AudienceId[] = ["straight", "gay", "trans"];
const WOMEN: AudienceId[] = ["straight"];

function category(
  input: Omit<Category, "traits"> & { traits: TraitVector },
): Category {
  return input;
}

export const CATEGORIES: readonly Category[] = [
  category({
    id: "amateur",
    label: "Amateur",
    slug: "amateur",
    audiences: ALL,
    tieBreak: 10,
    blurb: "Unscripted scenes with an everyday feel.",
    traits: {
      passionate: 2,
      intense: 1,
      casual: 5,
      polished: 0,
      performer: 2,
      scenario: 1,
      visual: 1,
      activity: 2,
    },
  }),
  category({
    id: "real-amateur",
    label: "Real amateur",
    slug: "real-amateur",
    audiences: ALL,
    tieBreak: 20,
    blurb: "Looser, more personal amateur scenes.",
    traits: {
      passionate: 3,
      intense: 1,
      casual: 4,
      polished: 0,
      performer: 4,
      scenario: 2,
      visual: 1,
      activity: 2,
    },
  }),
  category({
    id: "homemade-amateur",
    label: "Homemade",
    slug: "homemade-amateur",
    audiences: ALL,
    tieBreak: 30,
    blurb: "Home-shot scenes with a simple look.",
    traits: {
      passionate: 2,
      intense: 2,
      casual: 4,
      polished: 0,
      performer: 1,
      scenario: 2,
      visual: 2,
      activity: 2,
    },
  }),
  category({
    id: "amateur-pov",
    label: "Point of view",
    slug: "amateur-pov",
    audiences: ALL,
    tieBreak: 40,
    blurb: "First-person scenes that put you close to the action.",
    traits: {
      passionate: 2,
      intense: 2,
      casual: 3,
      polished: 1,
      performer: 1,
      scenario: 1,
      visual: 5,
      activity: 3,
    },
  }),
  category({
    id: "amateur-threesome",
    label: "Group scenes",
    slug: "amateur-threesome",
    audiences: ALL,
    tieBreak: 50,
    blurb: "Consensual group scenes with an amateur feel.",
    traits: {
      passionate: 1,
      intense: 4,
      casual: 4,
      polished: 1,
      performer: 2,
      scenario: 3,
      visual: 1,
      activity: 5,
    },
  }),
  category({
    id: "bdsm",
    label: "Power exchange",
    slug: "bdsm",
    audiences: ALL,
    tieBreak: 60,
    blurb: "Consensual power exchange, with a clearer dynamic.",
    traits: {
      passionate: 1,
      intense: 5,
      casual: 1,
      polished: 3,
      performer: 2,
      scenario: 4,
      visual: 2,
      activity: 4,
    },
  }),
  category({
    id: "massage",
    label: "Massage",
    slug: "massage",
    audiences: ALL,
    tieBreak: 70,
    blurb: "Touch-led scenes that start with a massage.",
    traits: {
      passionate: 4,
      intense: 1,
      casual: 1,
      polished: 3,
      performer: 2,
      scenario: 5,
      visual: 2,
      activity: 2,
    },
  }),
  category({
    id: "lesbian-massage",
    label: "Sensual massage",
    slug: "lesbian-massage",
    audiences: WOMEN,
    tieBreak: 80,
    blurb: "Slow, sensual scenes built around a massage.",
    traits: {
      passionate: 5,
      intense: 1,
      casual: 1,
      polished: 3,
      performer: 3,
      scenario: 5,
      visual: 2,
      activity: 2,
    },
  }),
  category({
    id: "lesbian-kissing",
    label: "Slow and sensual",
    slug: "lesbian-kissing",
    audiences: WOMEN,
    tieBreak: 90,
    blurb: "Affectionate scenes with a softer pace.",
    traits: {
      passionate: 5,
      intense: 0,
      casual: 1,
      polished: 3,
      performer: 3,
      scenario: 3,
      visual: 3,
      activity: 1,
    },
  }),
  category({
    id: "lesbian",
    label: "Women together",
    slug: "lesbian",
    audiences: WOMEN,
    tieBreak: 100,
    blurb: "Scenes centered on women together.",
    traits: {
      passionate: 3,
      intense: 2,
      casual: 2,
      polished: 3,
      performer: 3,
      scenario: 2,
      visual: 2,
      activity: 4,
    },
  }),
  category({
    id: "lesbian-milf",
    label: "Experienced women",
    slug: "lesbian-milf",
    audiences: WOMEN,
    tieBreak: 110,
    blurb: "Experienced women, with a more polished feel.",
    traits: {
      passionate: 4,
      intense: 2,
      casual: 1,
      polished: 3,
      performer: 5,
      scenario: 2,
      visual: 2,
      activity: 3,
    },
  }),
  category({
    id: "female-pov",
    label: "Her point of view",
    slug: "female-pov",
    audiences: WOMEN,
    tieBreak: 120,
    blurb: "Scenes framed from her point of view.",
    traits: {
      passionate: 3,
      intense: 2,
      casual: 2,
      polished: 3,
      performer: 2,
      scenario: 2,
      visual: 5,
      activity: 3,
    },
  }),
  category({
    id: "milf",
    label: "Mature women",
    slug: "milf",
    audiences: WOMEN,
    tieBreak: 130,
    blurb: "Mature women, with the performers front and center.",
    traits: {
      passionate: 2,
      intense: 2,
      casual: 2,
      polished: 4,
      performer: 5,
      scenario: 1,
      visual: 2,
      activity: 3,
    },
  }),
  category({
    id: "trans",
    label: "Trans performers",
    slug: "trans",
    audiences: ["trans"],
    tieBreak: 140,
    blurb: "A broad starting point for trans performers.",
    traits: {
      passionate: 2,
      intense: 2,
      casual: 2,
      polished: 4,
      performer: 5,
      scenario: 2,
      visual: 2,
      activity: 3,
    },
  }),
];
