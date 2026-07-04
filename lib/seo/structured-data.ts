import { getGraphSchema } from "./schema";

/**
 * Helper to return the stringified JSON-LD graph.
 * Fully compatible with HTML script injection:
 * `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getJsonLdString() }} />`
 */
export function getJsonLdString(): string {
  return JSON.stringify(getGraphSchema());
}
export default getJsonLdString;
