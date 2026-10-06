import type { AudienceId } from "@/lib/types";

export interface ExternalSearchRequest {
  /** A category slug. Providers must re-check the allowlist before building a URL. */
  category: string;
  audience: AudienceId;
}

export interface SearchProvider {
  id: string;
  label: string;
  buildUrl: (request: ExternalSearchRequest) => string | null;
}
