import * as React from "react"
import { cn } from "@/lib/utils"

export type SliderProps = React.InputHTMLAttributes<HTMLInputElement>;

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        className={cn(
          "w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "[&::-webkit-slider-runnable-track]:bg-slate-100 [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-moz-range-track]:bg-slate-100 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:shadow-blue-500/20 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-[1.01] [&::-webkit-slider-thumb]:hover:bg-brand-hover",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-primary [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:shadow-blue-500/20 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:hover:scale-[1.01] [&::-moz-range-thumb]:hover:bg-brand-hover",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }

