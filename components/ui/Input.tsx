import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, LabelHTMLAttributes } from "react";

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
          <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-teal-950">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <span className="absolute inset-y-0 right-3 flex items-center text-teal-600">{icon}</span>}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate-400",
              "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100 transition",
              icon && "pr-10",
              error && "border-danger focus:border-danger focus:ring-danger/10",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
