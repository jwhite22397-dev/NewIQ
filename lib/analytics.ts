/**
 * Privacy-preserving analytics hook.
 *
 * Events are names only. Do not add quiz answers, audience, or the
 * recommended category to this function. A future provider can subscribe
 * with setAnalyticsSink without changing call sites.
 */
export const ANALYTICS_EVENTS = [
  "quiz_started",
  "quiz_completed",
  "external_search_clicked",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

type AnalyticsSink = (event: AnalyticsEventName) => void;

let sink: AnalyticsSink | null = null;

export function setAnalyticsSink(next: AnalyticsSink | null): void {
  sink = next;
}

export function trackEvent(event: AnalyticsEventName): void {
  sink?.(event);
}
