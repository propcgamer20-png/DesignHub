import { en } from "@/lib/i18n/messages/en";
import type { PlainMessageKey } from "@/lib/i18n/translate";

/**
 * The message key for an effect's label or description. An effect added without a translation yet has
 * no key, so the picker shows the English text from its definition instead of an empty label.
 */
export function effectMessageKey(kind: string, part: "label" | "description"): PlainMessageKey | undefined {
  const key = `effects.kind.${kind}.${part}`;
  return Object.hasOwn(en, key) ? (key as PlainMessageKey) : undefined;
}
