import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "amber";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-teal-900 text-white hover:bg-teal-800 active:bg-teal-950 shadow-soft focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
  secondary: "bg-teal-100 text-teal-900 hover:bg-teal-200 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
  outline: "border border-teal-900 text-teal-900 hover:bg-teal-50 bg-transparent focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
  ghost: "text-teal-900 hover:bg-teal-50 bg-transparent focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
  danger: "bg-danger text-white hover:bg-danger/90 focus-visible:ring-2 focus-visible:ring-danger/50 focus-visible:ring-offset-2",
  amber: "bg-amber-500 text-teal-950 hover:bg-amber-400 shadow-soft font-bold focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2",
};

const sizes: Record<Size, string> = {
  sm: "text-xs md:text-sm px-3 py-2 md:py-2.5 rounded-lg gap-1.5 min-h-9",
  md: "text-sm px-4 py-3 md:py-2.5 rounded-xl gap-2 min-h-10",
  lg: "text-base px-6 py-3.5 md:py-4 rounded-xl gap-2 min-h-11",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, fullWidth, disabled, children, "aria-busy": ariaBusy, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "inline-flex items-center justify-center font-display font-semibold transition-colors duration-150 outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
