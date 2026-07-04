import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingOverlayProps {
  readonly fullscreen?: boolean;
  readonly container?: boolean;
  readonly spinner?: boolean;
  readonly progress?: number | string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly blur?: boolean;
  readonly className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  fullscreen = false,
  container = false,
  spinner = true,
  progress,
  title,
  subtitle,
  blur = true,
  className,
}) => {
  const overlayClasses = cn(
    "flex flex-col items-center justify-center text-center p-6 transition-opacity duration-200 z-50",
    {
      "fixed inset-0 bg-app-surface/70": fullscreen,
      "absolute inset-0 bg-app-surface/80": container && !fullscreen,
      "backdrop-blur-[4px]": blur,
      "w-full h-full min-h-[200px]": !fullscreen && !container,
    },
    className
  );

  return (
    <div className={overlayClasses}>
      <div className="flex flex-col items-center space-y-4 max-w-sm">
        {spinner && (
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-brand-light border-t-brand-primary animate-spin" />
            {progress !== undefined && (
              <span className="absolute text-xs font-semibold text-brand-accent">
                {typeof progress === 'number' ? `${Math.round(progress)}%` : progress}
              </span>
            )}
          </div>
        )}

        {!spinner && progress !== undefined && typeof progress === 'number' && (
          <div className="w-48 h-1.5 bg-brand-light rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-200 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {(title || subtitle) && (
          <div className="space-y-1">
            {title && (
              <h4 className="text-sm font-semibold text-app-text-primary tracking-tight">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-xs text-app-text-secondary max-w-[280px] mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';
export default LoadingOverlay;

