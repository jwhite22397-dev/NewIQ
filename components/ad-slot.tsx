export const AD_PLACEMENTS = ["landing", "result-bridge", "result"] as const;

export type AdPlacement = (typeof AD_PLACEMENTS)[number];

/**
 * Reserved space for a future adult-compatible ad provider.
 * The placeholder is labeled and does not imitate an advertisement.
 * Wire a provider by targeting `[data-ad-placement]` instead of editing pages.
 */
export function AdSlot({ placement }: { placement: AdPlacement }) {
  return (
    <aside aria-label="Advertisement" data-ad-placement={placement} className="ad-slot">
      <p className="ad-slot-label">Advertisement</p>
    </aside>
  );
}
