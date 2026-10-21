"use client";

import { Check, X } from "lucide-react";

import { ColorField } from "@/components/effects/fields";
import { useI18n } from "@/components/layout/locale-provider";
import { Badge } from "@/components/ui/badge";
import { SELECTION_MIN_CONTRAST, selectionContrast } from "@/lib/effects/selection";
import { useEffectSettings, useEffectsStore } from "@/store/effects-store";

export function SelectionControls() {
  const { t } = useI18n();
  const s = useEffectSettings("selection");
  const update = useEffectsStore((state) => state.update);
  const set = (patch: Partial<typeof s>) => update("selection", patch);
  const ratio = selectionContrast(s);
  const pass = ratio >= SELECTION_MIN_CONTRAST;

  return (
    <>
      <ColorField
        label={t("effects.selection.background")}
        value={s.background}
        onChange={(background) => set({ background })}
      />
      <ColorField label={t("effects.selection.text")} value={s.text} onChange={(text) => set({ text })} />
      <ColorField label={t("effects.selection.page")} value={s.page} onChange={(page) => set({ page })} />
      <div className="flex flex-col gap-2 rounded-lg border p-3" role="status" aria-live="polite">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{t("effects.selection.check")}</span>
          <Badge variant={pass ? "success" : "destructive"}>
            {pass ? <Check aria-hidden /> : <X aria-hidden />}
            {pass ? t("effects.result.pass") : t("effects.result.fail")}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("effects.selection.ratio", {
            ratio: `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`,
            required: SELECTION_MIN_CONTRAST,
          })}
        </p>
      </div>
    </>
  );
}
