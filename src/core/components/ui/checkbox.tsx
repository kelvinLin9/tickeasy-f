import * as React from "react";
import { Check, TriangleAlert } from "lucide-react";
import { cn } from "@/core/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string | React.ReactNode;
  required?: boolean;
  error?: boolean; // 新增
  errorMessage?: string; // 新增
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, label, checked, required, onChange, error, errorMessage, ...props }, ref) => {
    return (
      <div className="my-2 flex flex-col">
        <div className="flex items-center space-x-2">
          <label htmlFor={id} className="lg:text-md my-2 flex cursor-pointer items-center space-x-2 text-base">
            <div className="relative flex h-4 w-4 items-center justify-center">
              <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className={cn(
                  "peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-red-500", // 新增錯誤狀態樣式
                  className
                )}
                ref={ref}
                {...props}
              />
              <Check className="absolute h-4 w-4 text-white opacity-0 transition-opacity peer-data-[state=checked]:opacity-100" />
            </div>
            <span className="leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="ml-1 text-lg text-red-500">*</span>}
            </span>
          </label>
        </div>
        <p className="mt-1 flex items-center gap-1 pl-2 text-start text-sm text-red-500">
          {error && errorMessage && (
            <>
              <TriangleAlert className="h-4 w-4" />
              {errorMessage}
            </>
          )}
        </p>{" "}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
