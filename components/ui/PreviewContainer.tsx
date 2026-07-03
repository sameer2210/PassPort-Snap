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
      "w-full flex flex-col bg-white border border-[#0b1e3a]/8 rounded-xl shadow-md overflow-hidden relative",
      className
    )}>
      {/* Header Bar */}
      {(title || toolbar) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          {title ? (
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {title}
            </h4>
          ) : <div />}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {/* Main Preview Sandbox */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F7FAFF] relative overflow-hidden min-h-[320px]">
        {/* Loading overlay */}
        {loading && <LoadingOverlay container blur title="Processing image" />}

        {/* Content or Empty State */}
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

      {/* Footer Area */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
          {footer}
        </div>
      )}
    </div>
  );
};

PreviewContainer.displayName = 'PreviewContainer';
export default PreviewContainer;
