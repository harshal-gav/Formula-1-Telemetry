import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "racing" | "pro";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-racing-red disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variants = {
      default: "bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200",
      destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
      outline: "border border-zinc-700/60 bg-transparent shadow-sm hover:bg-zinc-800 hover:text-white text-zinc-300",
      secondary: "bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700",
      ghost: "hover:bg-zinc-800 hover:text-zinc-100 text-zinc-400",
      link: "text-zinc-200 underline-offset-4 hover:underline",
      racing: "bg-racing-red text-white font-semibold shadow-lg shadow-racing-red/25 hover:bg-racing-hoverRed active:scale-[0.98]",
      pro: "bg-gradient-to-r from-amber-500 via-racing-red to-purple-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:opacity-95 active:scale-[0.98]",
    };

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8 text-base",
      icon: "h-9 w-9",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

