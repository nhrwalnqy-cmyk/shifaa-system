import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-2 block text-sm font-semibold text-teal-950">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-teal-600 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            className={cn(
              "w-full rounded-xl border border-line bg-white px-4 py-3 md:py-2.5 text-sm text-ink placeholder:text-slate-400",
              "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1",
              icon && "ltr:pr-10 rtl:pl-10",
              error && "border-danger text-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-600">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
