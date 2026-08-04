import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-2 block text-sm font-semibold text-teal-950">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              "w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 md:py-2.5 text-sm text-ink",
              "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1",
              "ltr:pl-10 rtl:pr-10",
              error && "border-danger text-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-600" />
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
