"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            "w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white",
            "outline-none transition-colors cursor-pointer",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
