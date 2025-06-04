"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";

type PropsType = {
  label: string;
  items: { value: string; label: string }[];
  prefixIcon?: React.ReactNode;
  className?: string;
  required?: boolean;
} & (
  | { 
      placeholder?: string; 
      defaultValue: string;
      value?: never;
      onValueChange?: never;
    }
  | { 
      placeholder: string; 
      defaultValue?: string;
      value?: never;
      onValueChange?: never;
    }
  | {
      placeholder?: string;
      defaultValue?: never;
      value: string;
      onValueChange: (value: string) => void;
    }
);

export function Select({
  items,
  label,
  defaultValue,
  placeholder,
  prefixIcon,
  className,
  value,
  onValueChange,
  required = false,
}: PropsType) {
  const id = useId();
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsOptionSelected(true);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = value !== undefined;
  const selectValue = isControlled ? value : defaultValue;

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          id={id}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : (defaultValue || "")}
          onChange={handleChange}
          required={required}
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
            (isOptionSelected || (isControlled && value) || (!isControlled && defaultValue)) && "text-dark dark:text-white",
            prefixIcon && "pl-11.5",
          )}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
      </div>
    </div>
  );
}