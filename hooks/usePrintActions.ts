import { useState, useCallback } from 'react';
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
import { resolveExportPhotoUrl } from '@/lib/print/utils/imageResolver';

import { PRINT_DEFAULTS } from '@/lib/constants/printDefaults';

export interface UsePrintActionsInput {
  readonly paper: PaperSize;
  readonly template: PhotoTemplate;
  readonly layout: LayoutResult | null;
  readonly slots: readonly (string | null)[];
  readonly people: readonly Person[];
  readonly selectedPersonId: string | null;
  readonly showCutlines: boolean;
  readonly updatePerson: (id: string, updates: Partial<Person>) => void;
  readonly isSinglePhotoMode: boolean;
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
  people,
  selectedPersonId,
  showCutlines,
  updatePerson,
  isSinglePhotoMode,
}: UsePrintActionsInput): UsePrintActionsOutput {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSlotClick = useCallback(
    (index: number) => {
      const clickedPersonId = slots[index];
      if (clickedPersonId) {
        const p = people.find((x) => x.id === clickedPersonId);
        if (p) {
          updatePerson(p.id, { count: Math.max(0, p.count - 1) });
        }
      } else if (selectedPersonId) {
        const p = people.find((x) => x.id === selectedPersonId);
        if (p) {
          const currentTotalCount = people.reduce((acc, x) => acc + x.count, 0);
          if (currentTotalCount < (layout?.capacity || 0)) {
            updatePerson(p.id, { count: p.count + 1 });
          }
        }
      }
    },
    [slots, selectedPersonId, people, updatePerson, layout]
  );

  const handleAutoFill = useCallback(() => {
    if (!selectedPersonId) return;
    const currentTotalCount = people.reduce((acc, x) => acc + x.count, 0);
    const maxCapacity = layout?.capacity || 0;
    const remainingSpace = Math.max(0, maxCapacity - currentTotalCount);
    if (remainingSpace > 0) {
      const p = people.find((x) => x.id === selectedPersonId);
      if (p) {
        updatePerson(p.id, { count: p.count + remainingSpace });
      }
    }
  }, [selectedPersonId, people, updatePerson, layout]);

  const handleDownloadPdf = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Build imagesMap asynchronously using validated high-resolution photo resolver
      const imagesMap: Record<string, string> = {};
      for (const p of people) {
        const url = await resolveExportPhotoUrl(p);
        if (url) {
          imagesMap[p.id] = url;
        }
      }

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
        addBorder: PRINT_DEFAULTS.addBorder,
        showCutlines,
      });

      const pdfBlob = await PrintController.exportPdf(scene);
      DownloadAdapter.downloadBlob(pdfBlob, `passport-photos-${paper.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to generate PDF sheet. Please check your photos and try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [paper, template, slots, people, showCutlines]);

  const handlePrint = useCallback(async () => {
    setIsGenerating(true);
    try {
      let scene;
      let widthMm: number;
      let heightMm: number;

      if (isSinglePhotoMode) {
        if (!selectedPersonId) return;
        const selectedPerson = people.find((p) => p.id === selectedPersonId);
        if (!selectedPerson) return;

        const rawSrc = await resolveExportPhotoUrl(selectedPerson);
        if (!rawSrc) {
          throw new Error('Failed to load customer photo for single photo print.');
        }

        const adjustments: ImageAdjustments = {
          rotation: 0,
          brightness: 1,
          contrast: 1,
          cropArea: undefined,
          backgroundColor: undefined,
          sharpenAmount: 0.15,
        };

        scene = await PrintController.buildSinglePhotoScene(template, rawSrc, adjustments);
        widthMm = template.widthMm;
        heightMm = template.heightMm;
      } else {
        if (!layout) return;

        // Build imagesMap asynchronously using validated high-resolution photo resolver
        const imagesMap: Record<string, string> = {};
        for (const p of people) {
          const url = await resolveExportPhotoUrl(p);
          if (url) {
            imagesMap[p.id] = url;
          }
        }

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

        scene = await PrintController.buildScene({
          paper,
          template,
          slots,
          images: imagesMap,
          adjustments: adjustmentsMap,
          addBorder: PRINT_DEFAULTS.addBorder,
          showCutlines,
        });

        widthMm = layout.paperWidthMm;
        heightMm = layout.paperHeightMm;
      }

      const imgBlob = await PrintController.exportImage(scene, 'image/png');
      await BrowserPrintService.print(imgBlob, widthMm, heightMm);
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to print. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [
    isSinglePhotoMode,
    selectedPersonId,
    people,
    template,
    layout,
    paper,
    slots,
    showCutlines,
  ]);

  const handleDownloadSingle = useCallback(
    async (format: 'image/jpeg' | 'image/png') => {
      if (!selectedPersonId) return;
      setIsGenerating(true);
      try {
        const selectedPerson = people.find((p) => p.id === selectedPersonId);
        if (!selectedPerson) return;

        const rawSrc = await resolveExportPhotoUrl(selectedPerson);
        if (!rawSrc) {
          throw new Error('Failed to load customer photo for single photo export.');
        }

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
        alert((err as Error).message || 'Failed to export image. Please try again.');
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
