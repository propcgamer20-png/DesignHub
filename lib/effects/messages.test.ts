import { describe, expect, test } from "vitest";

import { effectMessageKey } from "@/lib/effects/messages";
import { effectDefinitions } from "@/lib/effects/registry";
import { catalogs, locales } from "@/lib/i18n/locales";
import { en } from "@/lib/i18n/messages/en";
import { createTranslator, lookup } from "@/lib/i18n/translate";

describe("effect messages", () => {
  test("every registered effect has a label and a description in every language", () => {
    for (const definition of effectDefinitions) {
      for (const part of ["label", "description"] as const) {
        const key = effectMessageKey(definition.kind, part);
        expect(key, `${definition.kind} ${part}`).toBeDefined();
        for (const locale of locales)
          expect(lookup(catalogs[locale], key!), `${locale} ${definition.kind}`).not.toBe("");
      }
    }
    // Spanish, French and Hindi are written out, not left to fall back to English.
    for (const locale of ["es", "fr", "hi"] as const) {
      const missing = effectDefinitions.flatMap((definition) =>
        (["label", "description"] as const)
          .map((part) => effectMessageKey(definition.kind, part)!)
          .filter((key) => !Object.hasOwn(catalogs[locale], key)),
      );
      expect(missing, locale).toEqual([]);
    }
  });

  test("the English messages match the text in each effect's definition", () => {
    for (const definition of effectDefinitions) {
      expect(en[effectMessageKey(definition.kind, "label")!], definition.kind).toBe(definition.label);
      expect(en[effectMessageKey(definition.kind, "description")!], definition.kind).toBe(definition.description);
    }
  });

  test("an effect without a translation yet has no key, so its English text is used", () => {
    expect(effectMessageKey("not-an-effect", "label")).toBeUndefined();
  });

  test("translated labels differ from English where the word changes", () => {
    expect(lookup(catalogs.es, effectMessageKey("shadow", "label")!)).toBe("Sombra");
    expect(lookup(catalogs.fr, effectMessageKey("focus-ring", "label")!)).toBe("Anneau de focus");
    expect(lookup(catalogs.hi, effectMessageKey("glass", "label")!)).toBe("ग्लास");
  });
});

describe("contrast messages", () => {
  const keys = ["effects.focusRing.ratios", "effects.scrollbar.ratio", "effects.selection.ratio"] as const;

  test("keep the ratio in a placeholder in every language, so it is never glued onto a sentence", () => {
    for (const locale of locales) {
      for (const key of keys) {
        const text = lookup(catalogs[locale], key);
        expect(text, `${locale} ${key}`).toMatch(/\{(ratio|pageRatio)\}/);
        expect(text, `${locale} ${key}`).toContain("{required}");
      }
    }
  });

  test("fill in the measured ratio and the required minimum", () => {
    for (const locale of locales) {
      const { t } = createTranslator(catalogs[locale], locale);
      const scrollbar = t("effects.scrollbar.ratio", { ratio: "4.52:1", required: 3 });
      expect(scrollbar).toContain("4.52:1");
      expect(scrollbar).toContain("3:1");
      expect(scrollbar).not.toContain("{");
      const focus = t("effects.focusRing.ratios", { pageRatio: "5.10:1", componentRatio: "3.20:1", required: 3 });
      expect(focus).toContain("5.10:1");
      expect(focus).toContain("3.20:1");
      expect(focus).not.toContain("{");
    }
  });

  test("the gradient color labels take their number as a placeholder", () => {
    for (const locale of locales) {
      const { t } = createTranslator(catalogs[locale], locale);
      expect(t("effects.field.gradientColor", { number: 2 })).toContain("2");
      expect(t("effects.field.removeGradientColor", { number: 3 })).toContain("3");
    }
  });
});
