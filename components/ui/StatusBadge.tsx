import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  readonly variant: 'success' | 'warning' | 'error' | 'processing' | 'info';
  readonly icon?: React.ReactNode;
  readonly loading?: boolean;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  icon,
  loading = false,
  children,
  className,
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/70',
    error: 'bg-red-50 text-red-700 border-red-200/70',
    processing: 'bg-brand-light/70 text-brand-primary border-brand-border',
    info: 'bg-slate-50 text-brand-accent border-slate-200',
  };

  const dotStyles = {
    success: 'bg-brand-success',
    warning: 'bg-brand-warning',
    error: 'bg-brand-danger',
    processing: 'bg-brand-primary animate-pulse',
    info: 'bg-brand-accent',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors duration-150",
      variantStyles[variant],
      className
    )}>
      {loading ? (
        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotStyles[variant])} />
      )}
      <span className="leading-none">{children}</span>
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
export default StatusBadge;

