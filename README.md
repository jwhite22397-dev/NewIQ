# NewIQ

NewIQ is an adults-only discovery site. Someone answers five short questions and gets one recommendation, then opens that category on a third-party search site.

NewIQ does not host videos, images, or performer photos. There are no accounts and no database. The quiz runs in the browser.

```
Open the site
→ Confirm 18+
→ Answer five questions
→ See one recommendation
→ Open the external search
```

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest, for the recommendation and URL rules

No authentication, database, or AI API.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other checks:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Set `NEXT_PUBLIC_SITE_URL` when you want canonical, Open Graph, robots, and sitemap URLs to use a real origin. It defaults to `http://localhost:3000`.

## Architecture

| Concern | Where it lives |
| --- | --- |
| Quiz questions and answer copy | `data/questions.ts` |
| Category taxonomy and weights | `data/categories.ts` |
| Scoring weights | `lib/scoringConfig.ts` |
| Scoring, ranking, surprise, alternatives | `lib/recommendationEngine.ts` |
| Allowlist and prohibited slug patterns | `lib/safety.ts` |
| PornMD URL rules | `lib/providers/pornmd.ts` |
| Which provider the result screen uses | `lib/providers/index.ts` |
| Analytics hook | `lib/analytics.ts` |
| Age-gate storage | `lib/ageGate.ts` |
| Ad placeholders | `components/ad-slot.tsx` |
| Screens | `components/` and `app/` |

The UI asks the questions and renders the result. It does not decide which category wins, and it does not assemble external URLs.

## Quiz

`data/questions.ts` defines the five steps:

1. Who the person wants to watch (women, men, or trans performers).
2. Vibe.
3. What matters most.
4. A short refinement list chosen from the earlier answers.
5. Adventurousness.

`QUIZ_STEPS` cannot be longer than five. Changing labels, hints, or refinement weights does not require a UI change as long as each step still exposes `id`, `prompt`, `supporting`, and answer cards with `id`, `label`, and `hint`.

Question 4 calls `getRefinementOptions()`. It returns at most four choices. “Surprise me” on the vibe question does not add a vibe bias. “No preference” does not add a focus bias.

## Recommendation scoring

`recommend()` in `lib/recommendationEngine.ts` filters categories to the selected audience, then scores the rest:

- The vibe trait is multiplied by `vibeWeight`.
- “Keep it familiar” adds `familiarBoost` on that same trait.
- The focus trait is multiplied by `focusWeight`.
- Question 4 weights are multiplied by `refinementScale`.

Higher scores rank first. Equal scores use `tieBreak` on the category.

Adventurousness changes the pick, not the catalog:

- **Keep it familiar** uses the top score.
- **Something slightly different** uses the runner-up when its score is at least `adjacentScoreRatio` of the leader. Otherwise it stays with the leader.
- **Surprise me** chooses among the top `surprisePoolSize` results. That is the only random step. Tests inject `random`.

“Give Me Another” calls `nextAlternative()`. It walks the existing ranking and returns the best result that has not been shown. It does not roll again.

An unknown audience, or a result that fails the allowlist, uses the safe fallback for that audience.

Tune the numbers in `lib/scoringConfig.ts` and the trait values in `data/categories.ts`.

## Categories

Add a category only after its public page has been checked:

1. Confirm `https://www.pornmd.com/c/{slug}` is a real category page.
2. Confirm the theme is consensual adult content and is not on the prohibited list in `lib/safety.ts`.
3. Add one object to `data/categories.ts` with an `id`, user-facing `label`, `slug`, `audiences`, trait scores, `tieBreak`, and a short `blurb`.
4. Run `npm test`.

Do not build an external URL anywhere else. Removing a category means deleting that object. If it is a fallback, point `FALLBACK_CATEGORY_ID` at another allowlisted category for the same audience.

`isAllowedCategory()` requires three things: the slug is in the taxonomy, it matches a lowercase hyphenated pattern, and it does not match a prohibited pattern (minors, non-consent, trafficking, family or incest themes, age-play, and related terms). A prohibited slug cannot become a link even if it is later typed into the taxonomy; the module throws on startup if the catalog itself contains one.

There is no free-text search.

## PornMD provider

All PornMD URL behavior is in `lib/providers/pornmd.ts`.

Verified shape:

- `https://www.pornmd.com/c/{allowlisted-slug}`
- Gay category pages use `orientation=gay` (verified on `/c/massage?orientation=gay`).
- The trans filter uses PornMD’s own query parameter, stored only in that file (verified on `/c/trans` with that parameter). It is not shown in the interface.
- Straight category pages omit the orientation parameter (verified on `/c/amateur` and other `/c/` pages).

`buildPornMdUrl()` re-checks the allowlist and the audience. If the slug is unknown, prohibited, or not valid for that audience, it substitutes the fallback category. If the audience itself is invalid, it uses the straight fallback and does not copy the invalid value into the query string. `assemblePornMdUrl()` returns `null` rather than emit a bad path.

The result screen calls `activeProvider` from `lib/providers/index.ts`.

### Add another provider

1. Add a module next to `lib/providers/pornmd.ts` that implements `SearchProvider`.
2. Re-validate `isAllowedCategory()` inside that module before building a URL.
3. Export it from `lib/providers/index.ts`.
4. Set `activeProvider` to the new provider.
5. Add URL tests beside the module.

The recommendation engine should stay unchanged.

### Still needs verification

These rules are centralized so they can be corrected after a manual check:

- Not every allowlisted slug was opened with every orientation. The path shape and the two orientation values were verified, then applied to the allowlist.
- `orientation=straight` is not used, because current straight category pages were observed without that parameter.
- Older path-style search URLs are not used.
- PornMD can rename or remove a category. Re-check a slug before adding it. Direct HTTP checks from the build environment were blocked (403), so the allowlist comes from publicly indexed `/c/` URLs.

## Privacy

- No account, name, email, phone, or profile.
- Quiz answers live in React state and are not written to a server or to local storage.
- The only local storage value is the age-gate confirmation (`newiq.ageConfirmed=yes`). If storage is blocked, the current visit can still continue.
- There is no recommendation history.
- `trackEvent()` accepts only `quiz_started`, `quiz_completed`, and `external_search_clicked`. It has no payload argument. The default sink does nothing. Connect a provider later with `setAnalyticsSink` without putting answers or the category on the event.

## Advertising

`AdSlot` is a labeled placeholder. It does not load an ad script and it does not look like a fake ad. Placements:

- `landing` — below the steps on the home page
- `result-bridge` — between the “your match” line and the recommendation
- `result` — below the actions on the result screen

A future provider can target `[data-ad-placement]`. The quiz questions themselves do not have a slot.

## Pages

- `/` landing
- `/quiz` age gate, questions, and result
- `/privacy`
- `/terms`
- `/content-policy`

Privacy, terms, and the content policy describe this version’s design. They should be reviewed by counsel before a public launch. They are not a warranty about third-party sites.

## Accessibility

The quiz uses buttons, a progress bar, a question group, visible focus, and a skip link. Motion is reduced when the visitor asks for that.
