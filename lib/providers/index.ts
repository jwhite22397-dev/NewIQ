import { buildPornMdUrl } from "@/lib/providers/pornmd";
import type { SearchProvider } from "@/lib/providers/types";

export const pornMdProvider: SearchProvider = {
  id: "pornmd",
  label: "PornMD",
  buildUrl: buildPornMdUrl,
};

/**
 * The outbound provider used by the result screen.
 * Swap this export to add another search destination later.
 */
export const activeProvider: SearchProvider = pornMdProvider;

export type { ExternalSearchRequest, SearchProvider } from "@/lib/providers/types";
