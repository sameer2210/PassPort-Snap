import React from 'react';
import { cn } from '@/lib/utils';
import LoadingOverlay from './LoadingOverlay';

export interface PreviewContainerProps {
  readonly title?: string;
  readonly toolbar?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly aspectRatio?: string; // Tailwind aspect classes e.g. "aspect-[3/4]"
  readonly loading?: boolean;
  readonly emptyState?: React.ReactNode;
  readonly children?: React.ReactNode;
  readonly className?: string;
}

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  title,
  toolbar,
  footer,
  aspectRatio,
  loading = false,
  emptyState,
  children,
  className,
}) => {
  return (
    <div className={cn(
      "w-full flex flex-col bg-app-surface border border-app-border rounded-2xl shadow-sm shadow-black/5 overflow-hidden relative",
      className
    )}>
      {(title || toolbar) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-app-border bg-app-surface-muted/45">
          {title ? (
            <h4 className="text-xs font-semibold uppercase tracking-wider text-app-text-muted">
              {title}
            </h4>
          ) : <div />}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6 bg-app-background relative overflow-hidden min-h-[320px]">
        {loading && <LoadingOverlay container blur title="Processing image" />}

        {!loading && emptyState ? (
          <div className="flex items-center justify-center w-full h-full text-center">
            {emptyState}
          </div>
        ) : (
          <div className={cn(
            "relative w-full h-full max-w-full max-h-full flex items-center justify-center",
            aspectRatio
          )}>
            {children}
          </div>
        )}
      </div>

      {footer && (
        <div className="px-4 py-3 bg-app-surface-muted/45 border-t border-app-border flex items-center justify-between gap-4">
          {footer}
        </div>
      )}
    </div>
  );
};

PreviewContainer.displayName = 'PreviewContainer';
export default PreviewContainer;

