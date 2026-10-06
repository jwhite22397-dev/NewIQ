import { ANALYTICS_EVENTS, setAnalyticsSink, trackEvent } from "@/lib/analytics";
import { describe, expect, it } from "vitest";

describe("analytics", () => {
  it("emits only the event name", () => {
    const seen: string[] = [];
    setAnalyticsSink((event) => {
      expect(Object.keys({ event })).toEqual(["event"]);
      seen.push(event);
    });

    for (const event of ANALYTICS_EVENTS) trackEvent(event);

    expect(seen).toEqual([...ANALYTICS_EVENTS]);
    setAnalyticsSink(null);
    trackEvent("quiz_started");
    expect(seen).toHaveLength(ANALYTICS_EVENTS.length);
  });
});
