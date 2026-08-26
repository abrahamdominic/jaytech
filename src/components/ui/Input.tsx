import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-secondary"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm transition-all duration-200",
            "placeholder:text-muted/60",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-dim",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
