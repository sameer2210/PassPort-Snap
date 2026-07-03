import React from 'react';
import { cn } from '@/lib/utils';

export interface ActionGroupProps {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly responsiveStacking?: boolean; // defaults to true, stacks vertical on mobile
  readonly primary?: React.ReactNode;
  readonly secondary?: React.ReactNode;
  readonly destructive?: React.ReactNode;
  readonly loading?: boolean;
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly equalWidth?: boolean;
}

export const ActionGroup: React.FC<ActionGroupProps> = ({
  orientation = 'horizontal',
  responsiveStacking = true,
  primary,
  secondary,
  destructive,
  loading = false,
  children,
  className,
  equalWidth = false,
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3 transition-opacity",
      {
        "flex-col": orientation === 'vertical',
        "flex-row": orientation === 'horizontal' && !responsiveStacking,
        "flex-col md:flex-row w-full md:w-auto": orientation === 'horizontal' && responsiveStacking && !equalWidth,
        "flex-row w-full [&>*]:flex-1": equalWidth,
        "opacity-75 pointer-events-none": loading,
      },
      className
    )}>
      {/* If child elements are provided, render them directly */}
      {children ? (
        children
      ) : (
        /* Otherwise render actions by structured weight */
        <>
          {secondary && (
            <div className={cn("w-full md:w-auto", { "order-2 md:order-1": orientation === 'horizontal' && responsiveStacking })}>
              {secondary}
            </div>
          )}
          {destructive && (
            <div className={cn("w-full md:w-auto", { "order-3": orientation === 'horizontal' && responsiveStacking })}>
              {destructive}
            </div>
          )}
          {primary && (
            <div className={cn("w-full md:w-auto", { "order-1 md:order-2": orientation === 'horizontal' && responsiveStacking })}>
              {primary}
            </div>
          )}
        </>
      )}
    </div>
  );
};

ActionGroup.displayName = 'ActionGroup';
export default ActionGroup;
