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
    success: 'bg-emerald-50 text-brand-success border-emerald-200/50',
    warning: 'bg-amber-50 text-brand-warning border-amber-200/50',
    error: 'bg-red-50 text-brand-danger border-red-200/50',
    processing: 'bg-brand-light text-brand-primary border-brand-border',
    info: 'bg-blue-50 text-[#0B3C8C] border-blue-200/50',
  };

  const dotStyles = {
    success: 'bg-brand-success',
    warning: 'bg-brand-warning',
    error: 'bg-brand-danger',
    processing: 'bg-brand-primary animate-pulse',
    info: 'bg-[#0B3C8C]',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200",
      variantStyles[variant],
      className
    )}>
      {/* Animated Loading Spinner */}
      {loading ? (
        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : (
        /* Status Dot Indicator */
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotStyles[variant])} />
      )}
      
      <span className="leading-none">{children}</span>
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
export default StatusBadge;
