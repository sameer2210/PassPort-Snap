import { useState, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  PaperSize,
  PhotoTemplate,
  LayoutResult,
  PrintController,
  BrowserPrintService,
  DownloadAdapter,
} from '@/lib/print';
import type { ImageAdjustments } from '@/lib/print';
import type { Person } from '@/lib/types';

export interface UsePrintActionsInput {
  readonly paper: PaperSize;
  readonly template: PhotoTemplate;
  readonly layout: LayoutResult | null;
  readonly slots: readonly (string | null)[];
  readonly setSlots: Dispatch<SetStateAction<Array<string | null>>>;
  readonly people: readonly Person[];
  readonly selectedPersonId: string | null;
  readonly addBorder: boolean;
  readonly showCutlines: boolean;
  readonly updatePerson: (id: string, updates: Partial<Person>) => void;
}

export interface UsePrintActionsOutput {
  readonly isGenerating: boolean;
  readonly handleSlotClick: (index: number) => void;
  readonly handleAutoFill: () => void;
  readonly handleDownloadPdf: () => void;
  readonly handlePrint: () => void;
  readonly handleDownloadSingle: (format: 'image/jpeg' | 'image/png') => void;
}

export function usePrintActions({
  paper,
  template,
  layout,
  slots,
  setSlots,
  people,
  selectedPersonId,
  addBorder,
  showCutlines,
  updatePerson,
}: UsePrintActionsInput): UsePrintActionsOutput {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSlotClick = useCallback(
    (index: number) => {
      const newSlots = [...slots];
      if (newSlots[index]) {
        newSlots[index] = null;
      } else if (selectedPersonId) {
        newSlots[index] = selectedPersonId;
      }
      setSlots(newSlots);

      // Sync counts back
      people.forEach((p) => {
        const count = newSlots.filter((s) => s === p.id).length;
        if (p.count !== count) {
          updatePerson(p.id, { count });
        }
      });
    },
    [slots, selectedPersonId, people, updatePerson, setSlots]
  );

  const handleAutoFill = useCallback(() => {
    if (!selectedPersonId) return;
    const newSlots = [...slots];
    for (let i = 0; i < newSlots.length; i++) {
      if (!newSlots[i]) {
        newSlots[i] = selectedPersonId;
      }
    }
    setSlots(newSlots);

    people.forEach((p) => {
      const count = newSlots.filter((s) => s === p.id).length;
      if (p.count !== count) {
        updatePerson(p.id, { count });
      }
    });
  }, [selectedPersonId, slots, people, updatePerson, setSlots]);

  const handleDownloadPdf = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Build imagesMap (on-demand, not state/memoized)
      const imagesMap: Record<string, string> = {};
      people.forEach((p) => {
        const url = p.highResFinalUrl || p.finalPhotoUrl || p.croppedPhotoUrl || p.previewPhotoUrl;
        if (url) {
          imagesMap[p.id] = url;
        }
      });

      // Build adjustmentsMap (on-demand, not state/memoized)
      const adjustmentsMap: Record<string, ImageAdjustments> = {};
      people.forEach((p) => {
        adjustmentsMap[p.id] = {
          rotation: 0,
          brightness: 1,
          contrast: 1,
          cropArea: undefined,
          backgroundColor: undefined,
          sharpenAmount: 0.15,
        };
      });

      const scene = await PrintController.buildScene({
        paper,
        template,
        slots,
        images: imagesMap,
        adjustments: adjustmentsMap,
        addBorder,
        showCutlines,
      });

      const pdfBlob = await PrintController.exportPdf(scene);
      DownloadAdapter.downloadBlob(pdfBlob, `passport-photos-${paper.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF sheet. Please check your photos and try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [paper, template, slots, people, addBorder, showCutlines]);

  const handlePrint = useCallback(() => {
    if (layout) {
      BrowserPrintService.print(layout.geometry.paperWidth, layout.geometry.paperHeight);
    }
  }, [layout]);

  const handleDownloadSingle = useCallback(
    async (format: 'image/jpeg' | 'image/png') => {
      if (!selectedPersonId) return;
      setIsGenerating(true);
      try {
        const selectedPerson = people.find((p) => p.id === selectedPersonId);
        if (!selectedPerson) return;

        const rawSrc =
          selectedPerson.highResFinalUrl ||
          selectedPerson.finalPhotoUrl ||
          selectedPerson.croppedPhotoUrl ||
          selectedPerson.previewPhotoUrl ||
          '';

        const adjustments: ImageAdjustments = {
          rotation: 0,
          brightness: 1,
          contrast: 1,
          cropArea: undefined,
          backgroundColor: undefined,
          sharpenAmount: 0.15,
        };

        const scene = await PrintController.buildSinglePhotoScene(template, rawSrc, adjustments);
        const imgBlob = await PrintController.exportImage(scene, format);
        const ext = format === 'image/png' ? 'png' : 'jpg';
        DownloadAdapter.downloadBlob(imgBlob, `passport-photo-${selectedPersonId}.${ext}`);
      } catch (err) {
        console.error(err);
        alert('Failed to export image. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    },
    [selectedPersonId, people, template]
  );

  return {
    isGenerating,
    handleSlotClick,
    handleAutoFill,
    handleDownloadPdf,
    handlePrint,
    handleDownloadSingle,
  };
}
