import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  readonly illustration?: React.ReactNode;
  readonly icon?: React.ReactNode;
  readonly title: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly action?: React.ReactNode;
  readonly secondaryAction?: React.ReactNode;
  readonly className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-5 select-none",
      className
    )}>
      {illustration ? (
        <div className="flex-shrink-0 mb-2">{illustration}</div>
      ) : icon ? (
        <div className="w-12 h-12 rounded-full bg-brand-light/70 text-brand-primary flex items-center justify-center mx-auto mb-2 shadow-inner shadow-blue-500/5">
          {icon}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-app-text-primary tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-app-text-secondary max-w-[280px] mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2 w-full">
          {secondaryAction && <div className="w-full sm:w-auto">{secondaryAction}</div>}
          {action && <div className="w-full sm:w-auto">{action}</div>}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
export default EmptyState;

