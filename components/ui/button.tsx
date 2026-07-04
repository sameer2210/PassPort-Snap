import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-brand-primary text-white shadow-sm shadow-blue-500/10 hover:bg-brand-hover active:bg-brand-pressed",
      destructive: "bg-brand-danger text-white shadow-sm shadow-red-500/10 hover:bg-red-700 active:bg-red-800",
      outline: "border border-app-border bg-app-surface text-app-text-primary hover:border-brand-primary/35 hover:bg-slate-50 active:bg-slate-100",
      secondary: "bg-app-surface-muted text-app-text-primary hover:bg-slate-200 active:bg-slate-300",
      ghost: "text-app-text-secondary hover:bg-slate-100 hover:text-app-text-primary active:bg-slate-200",
      link: "text-brand-primary underline-offset-4 hover:text-brand-hover hover:underline",
    }
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8 text-lg",
      icon: "h-10 w-10",
    }
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

