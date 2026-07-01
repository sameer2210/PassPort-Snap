export const DownloadAdapter = {
  downloadBlob: (blob: Blob, filename: string): void => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Revoke the object URL to prevent memory leaks
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 150);
  }
} as const;
