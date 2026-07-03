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
          "border-b border-gray-100": divider,
        },
        className
      )}>
        {/* Header: Label and Value */}
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            {label}
          </span>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded min-w-10 text-center select-none">
            {value}
          </span>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 leading-normal">
            {description}
          </p>
        )}

        {/* Control (e.g. Slider) */}
        <div className="w-full pt-1">
          {control}
        </div>

        {/* Helper Text */}
        {helperText && (
          <p className="text-[10px] font-medium text-gray-400 mt-1">
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
        "border-b border-gray-100": divider,
      },
      className
    )}>
      {/* Label and Info */}
      <div className="flex-1 min-w-[200px] space-y-0.5">
        <div className="text-sm font-medium text-gray-900 tracking-tight">
          {label}
        </div>
        {description && (
          <p className="text-xs text-gray-500 max-w-[450px] leading-normal">
            {description}
          </p>
        )}
      </div>

      {/* Input Control and Helper Text */}
      <div className="flex flex-col items-stretch md:items-end gap-1.5 min-w-[180px]">
        <div className="w-full flex justify-end">{control}</div>
        {helperText && (
          <p className="text-[10px] font-medium text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};

SettingsRow.displayName = 'SettingsRow';
export default SettingsRow;
