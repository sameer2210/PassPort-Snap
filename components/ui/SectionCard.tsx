import React from 'react';
import { cn } from '@/lib/utils';
import LoadingOverlay from './LoadingOverlay';

export interface SectionCardProps {
  readonly title?: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly icon?: React.ReactNode;
  readonly badge?: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly loading?: boolean;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions,
  footer,
  loading = false,
  children,
  className,
}) => {
  return (
    <div className={cn(
      "w-full bg-app-surface border border-app-border rounded-2xl shadow-sm shadow-black/5 overflow-hidden relative flex flex-col transition-all duration-200 hover:border-app-border-strong hover:shadow-md hover:shadow-black/5",
      className
    )}>
      {loading && <LoadingOverlay container blur title="Updating section" />}

      {(title || subtitle || icon || badge || actions) && (
        <div className="px-5 py-4 border-b border-app-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {icon && (
              <span className="text-brand-primary p-1.5 bg-brand-light/70 rounded-xl">
                {icon}
              </span>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {title && (
                  <h3 className="font-semibold text-sm leading-tight text-app-text-primary tracking-tight">
                    {title}
                  </h3>
                )}
                {badge && <div className="flex-shrink-0">{badge}</div>}
              </div>
              {subtitle && (
                <p className="text-xs text-app-text-secondary leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="flex-1 p-5">
        {children}
      </div>

      {footer && (
        <div className="px-5 py-3 border-t border-app-border bg-app-surface-muted/50 flex items-center justify-between gap-4">
          {footer}
        </div>
      )}
    </div>
  );
};

SectionCard.displayName = 'SectionCard';
export default SectionCard;

