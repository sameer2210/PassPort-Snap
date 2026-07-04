import React from 'react';
import { cn } from '@/lib/utils';

export interface SettingsRowProps {
  readonly label: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly control: React.ReactNode;
  readonly helperText?: React.ReactNode;
  readonly divider?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly value?: React.ReactNode;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  control,
  helperText,
  divider = false,
  disabled = false,
  className,
  value,
}) => {
  if (value !== undefined) {
    return (
      <div className={cn(
        "py-4 flex flex-col space-y-1.5 transition-opacity",
        {
          "opacity-50 pointer-events-none": disabled,
          "border-b border-app-border": divider,
        },
        className
      )}>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold text-app-text-primary tracking-tight">
            {label}
          </span>
          <span className="text-xs font-bold text-brand-primary bg-brand-light/70 px-2 py-0.5 rounded-lg min-w-10 text-center select-none">
            {value}
          </span>
        </div>
        {description && (
          <p className="text-xs text-app-text-secondary leading-relaxed">
            {description}
          </p>
        )}
        <div className="w-full pt-1">
          {control}
        </div>
        {helperText && (
          <p className="text-[10px] font-medium text-app-text-muted mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "py-4 flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between gap-4 transition-opacity",
      {
        "opacity-50 pointer-events-none": disabled,
        "border-b border-app-border": divider,
      },
      className
    )}>
      <div className="flex-1 min-w-[200px] space-y-0.5">
        <div className="text-sm font-medium text-app-text-primary tracking-tight">
          {label}
        </div>
        {description && (
          <p className="text-xs text-app-text-secondary max-w-[450px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col items-stretch md:items-end gap-1.5 min-w-[180px]">
        <div className="w-full flex justify-end">{control}</div>
        {helperText && (
          <p className="text-[10px] font-medium text-app-text-muted">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};

SettingsRow.displayName = 'SettingsRow';
export default SettingsRow;

