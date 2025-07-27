import { cn } from "@/core/lib/utils";
import { TriangleAlert } from "lucide-react";

import * as React from "react";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  error?: boolean;
  errorMessage?: string;
  labelClass?: string;
  inputClass?: string;
  required?: boolean;
  height?: string | number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { height = 80, id, type, label, placeholder, disabled, maxLength, required, error, errorMessage, labelClass, inputClass, className, ...props },
    ref
  ) => {
    const heightStyle = height ? `${height}px` : "80px";
    return (
      <div className={cn("m-1 flex w-full flex-col")} style={{ height: heightStyle }}>
        <label className={`${labelClass} pl-1`} htmlFor={id}>
          {label}
          {required && <span className="ml-1 text-lg text-red-500">*</span>}
        </label>
        <input
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            inputClass,
            className
          )}
          type={type}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          ref={ref}
          {...props}
        />
        <p className="mt-1 flex items-center gap-1 pl-2 text-start text-sm text-red-500">
          {error && errorMessage && (
            <>
              <TriangleAlert className="h-4 w-4 flex-shrink-0" />
              {errorMessage}
            </>
          )}
        </p>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
