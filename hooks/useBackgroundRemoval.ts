import { useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { rmbgEngine } from '@/lib/background/backgroundService';
import { backgroundCache } from '@/lib/background/backgroundCache';
import { compositeColorBase64, compositeColorBlobUrl } from '@/lib/background/backgroundCanvas';
import { templates } from '@/lib/config';
import { DpiProfile } from '@/lib/print';
import { getCroppedImg } from '@/lib/cropImage';

export function useBackgroundRemoval() {
  const activeRequestId = useRef<number>(0);

  // Subscribe to only the fields we need to expose from the hook
  const status = useAppStore(state => state.backgroundStatus);
  const processing = useAppStore(state => state.processing);
  const error = useAppStore(state => state.backgroundError);

  const processPreview = useCallback(async (
    personId: string,
    colorOption: 'original' | 'white' | 'blue' | 'custom',
    customColorHex: string
  ) => {
    const storeState = useAppStore.getState();
    const person = storeState.people.find(p => p.id === personId);
    if (!person) return;
    const croppedPhotoUrl = person.croppedPhotoUrl || person.previewPhotoUrl || '';

    // 1. Increment request ID for cancellation
    const requestId = ++activeRequestId.current;

    // Reset error state
    storeState.setBackgroundError(null);

    // 2. Original color choice -> no processing, direct bypass
    if (colorOption === 'original') {
      storeState.setBackgroundStatus('idle');
      storeState.setProcessing(false);
      storeState.updatePerson(personId, { backgroundPreviewUrl: croppedPhotoUrl });
      return;
    }

    storeState.setProcessing(true);

    try {
      // 3. Ensure engine model is loaded
      if (!storeState.modelLoaded) {
        if (requestId !== activeRequestId.current) return;
        storeState.setBackgroundStatus('checking-model');
        
        await rmbgEngine.ensureModel(() => {
          if (requestId !== activeRequestId.current) return;
          storeState.setBackgroundStatus('downloading-model');
        });
        
        if (requestId !== activeRequestId.current) return;
        storeState.setBackgroundStatus('initializing-model');
        await rmbgEngine.initialize();
        storeState.setModelLoaded(true);
      }

      if (requestId !== activeRequestId.current) return;

      // 4. Retrieve or generate transparent preview PNG from Cache
      let transparentBlob = backgroundCache.get(personId)?.previewBlob;

      if (!transparentBlob) {
        storeState.setBackgroundStatus('processing-preview');
        // Fetch base64 croppedPhotoUrl as blob
        const res = await fetch(croppedPhotoUrl);
        const imageBlob = await res.blob();
        
        if (requestId !== activeRequestId.current) return;
        
        // Execute background removal
        transparentBlob = await rmbgEngine.remove(imageBlob);
        
        if (requestId !== activeRequestId.current) return;
        
        // Write to Cache
        backgroundCache.setPreview(personId, transparentBlob);
      }

      if (requestId !== activeRequestId.current) return;
      storeState.setBackgroundStatus('compositing');

      // 5. Compositing
      const color = colorOption === 'white' ? '#ffffff' : colorOption === 'blue' ? '#e0f2fe' : customColorHex;
      
      const cachedItem = backgroundCache.get(personId);
      if (!cachedItem?.previewBlob) throw new Error('Preview cache entry missing');

      // Create composite canvas and output base64
      const baseTemplate = templates.find(t => t.id === storeState.templateId) || templates[0];
      const targetW = storeState.templateId === 'custom'
        ? Math.round((storeState.customTemplateMm.widthMm / 25.4) * DpiProfile.Print300)
        : baseTemplate.printWidthPx;
      const targetH = storeState.templateId === 'custom'
        ? Math.round((storeState.customTemplateMm.heightMm / 25.4) * DpiProfile.Print300)
        : baseTemplate.printHeightPx;

      const finalBase64 = await compositeColorBase64(cachedItem.previewBlob, color, targetW, targetH);
      
      if (requestId !== activeRequestId.current) return;
      
      // Update state
      storeState.updatePerson(personId, { backgroundPreviewUrl: finalBase64 });
      storeState.setBackgroundStatus('completed');
    } catch (err) {
      if (requestId !== activeRequestId.current) return;
      console.error('Failed to process preview background:', err);
      storeState.setBackgroundError(err instanceof Error ? err.message : 'Unknown error');
      storeState.setBackgroundStatus('error');
      // Fallback
      storeState.updatePerson(personId, { backgroundPreviewUrl: croppedPhotoUrl });
    } finally {
      if (requestId === activeRequestId.current) {
        storeState.setProcessing(false);
      }
    }
  }, []);

  const processHighRes = useCallback(async (
    personId: string,
    colorOption: 'original' | 'white' | 'blue' | 'custom',
    customColorHex: string
  ): Promise<boolean> => {
    const storeState = useAppStore.getState();
    const person = storeState.people.find(p => p.id === personId);
    if (!person) return false;

    const highResPhotoUrl = person.highResPhotoUrl;
    const croppedPhotoUrl = person.croppedPhotoUrl || person.previewPhotoUrl || '';
    const cropConfig = person.croppedAreaPixels || { x: 0, y: 0, width: 100, height: 100 };
    const rotation = person.rotation ?? 0;
    const brightness = person.brightness ?? 100;
    const contrast = person.contrast ?? 100;

    const requestId = ++activeRequestId.current;
    storeState.setBackgroundError(null);

    // Get color Hex
    const color = colorOption === 'white' ? '#ffffff' : colorOption === 'blue' ? '#e0f2fe' : customColorHex;

    const baseTemplate = templates.find(t => t.id === storeState.templateId) || templates[0];
    const targetW = storeState.templateId === 'custom'
      ? Math.round((storeState.customTemplateMm.widthMm / 25.4) * DpiProfile.Print300)
      : baseTemplate.printWidthPx;
    const targetH = storeState.templateId === 'custom'
      ? Math.round((storeState.customTemplateMm.heightMm / 25.4) * DpiProfile.Print300)
      : baseTemplate.printHeightPx;

    // 1. Original choice -> skip background removal, crop only
    if (colorOption === 'original') {
      storeState.setBackgroundStatus('compositing');
      try {
        const cropSource = highResPhotoUrl || croppedPhotoUrl;
        const finalUrl = await getCroppedImg(
          cropSource,
          cropConfig,
          rotation,
          { horizontal: false, vertical: false },
          brightness,
          contrast,
          targetW,
          targetH
        );
        if (requestId !== activeRequestId.current) return false;
        
        storeState.updatePerson(personId, { 
          highResFinalUrl: finalUrl,
          finalPhotoUrl: croppedPhotoUrl // Persisted base64 crop fallback
        });
        storeState.setBackgroundStatus('completed');
        return true;
      } catch (err) {
        console.error('Failed to compile original cropped image:', err);
        return false;
      }
    }

    storeState.setProcessing(true);
    try {
      // 2. Ensure model is initialized
      if (!storeState.modelLoaded) {
        storeState.setBackgroundStatus('checking-model');
        await rmbgEngine.ensureModel();
        storeState.setBackgroundStatus('initializing-model');
        await rmbgEngine.initialize();
        storeState.setModelLoaded(true);
      }

      if (requestId !== activeRequestId.current) return false;

      // 3. Generate transparent high-res PNG cutout
      let transparentHighResBlob = backgroundCache.get(personId)?.highResBlob;

      if (!transparentHighResBlob) {
        storeState.setBackgroundStatus('processing-highres');
        
        // First perform cropping, rotation, adjustments on source
        const cropSource = highResPhotoUrl || croppedPhotoUrl;
        const cropOutputUrl = await getCroppedImg(
          cropSource,
          cropConfig,
          rotation,
          { horizontal: false, vertical: false },
          brightness,
          contrast,
          targetW,
          targetH
        );

        if (!cropOutputUrl) throw new Error('Crop output returned empty');
        if (requestId !== activeRequestId.current) return false;

        const res = await fetch(cropOutputUrl);
        const cropBlob = await res.blob();

        if (requestId !== activeRequestId.current) return false;

        // Perform background removal on the full-resolution crop
        transparentHighResBlob = await rmbgEngine.remove(cropBlob);

        if (requestId !== activeRequestId.current) return false;

        // Save transparent high-res PNG to cache
        backgroundCache.setHighRes(personId, transparentHighResBlob);
      }

      if (requestId !== activeRequestId.current) return false;
      storeState.setBackgroundStatus('compositing');

      const cachedItem = backgroundCache.get(personId);
      if (!cachedItem?.highResBlob) throw new Error('High-res cache entry missing');

      // 4. Composite high-res cutout with color (generates Blob URL)
      const finalHighResUrl = await compositeColorBlobUrl(
        cachedItem.highResBlob,
        color,
        targetW,
        targetH
      );

      if (requestId !== activeRequestId.current) return false;

      // 5. Generate finalPhotoUrl (persisted base64) using cached transparent preview
      const cachedPreview = backgroundCache.get(personId)?.previewBlob;
      let finalPhotoUrl = person.finalPhotoUrl;
      if (cachedPreview) {
        finalPhotoUrl = await compositeColorBase64(cachedPreview, color, targetW, targetH);
      } else {
        finalPhotoUrl = croppedPhotoUrl;
      }

      if (requestId !== activeRequestId.current) return false;

      // 6. Update Zustand store
      storeState.updatePerson(personId, { 
        highResFinalUrl: finalHighResUrl,
        finalPhotoUrl: finalPhotoUrl
      });

      storeState.setBackgroundStatus('completed');
      return true;
    } catch (err) {
      if (requestId !== activeRequestId.current) return false;
      console.error('Failed to process high-res background:', err);
      storeState.setBackgroundError(err instanceof Error ? err.message : 'Unknown error');
      storeState.setBackgroundStatus('error');
      return false;
    } finally {
      if (requestId === activeRequestId.current) {
        storeState.setProcessing(false);
      }
    }
  }, []);

  const cancelActiveTask = useCallback(() => {
    activeRequestId.current++; // Invalidates existing request IDs
    const storeState = useAppStore.getState();
    storeState.setBackgroundStatus('idle');
    storeState.setProcessing(false);
  }, []);

  return {
    processPreview,
    processHighRes,
    cancelActiveTask,
    status,
    processing,
    error,
  };
}
