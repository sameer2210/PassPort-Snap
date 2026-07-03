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
      "w-full bg-white border border-[#0b1e3a]/8 rounded-xl shadow-sm overflow-hidden relative flex flex-col transition-all duration-200 hover:shadow-md",
      className
    )}>
      {loading && <LoadingOverlay container blur title="Updating section" />}

      {/* Card Header */}
      {(title || subtitle || icon || badge || actions) && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {icon && (
              <span className="text-brand-primary p-1 bg-brand-light rounded-md">
                {icon}
              </span>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {title && (
                  <h3 className="font-semibold text-sm leading-tight text-gray-900 tracking-tight">
                    {title}
                  </h3>
                )}
                {badge && <div className="flex-shrink-0">{badge}</div>}
              </div>
              {subtitle && (
                <p className="text-xs text-gray-500 leading-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="flex-1 p-5">
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
          {footer}
        </div>
      )}
    </div>
  );
};

SectionCard.displayName = 'SectionCard';
export default SectionCard;
