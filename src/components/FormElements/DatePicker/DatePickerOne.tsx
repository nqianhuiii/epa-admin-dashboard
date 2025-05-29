"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

interface PropsType {
  label?: string;
  name: string;
  value: string;
  onChange: (dateStr: string, dateObj: Date) => void;
  placeholder?: string;
}

const DatePickerOne = ({
  label = "Date picker",
  name,
  value,
  onChange,
  placeholder = "mm/dd/yyyy",
}: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const picker = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j, Y",
      defaultDate: value,
      onChange: function (selectedDates, dateStr) {
        if (selectedDates.length > 0) {
          onChange(dateStr, selectedDates[0]);
        }
      },
    });

    return () => {
      picker.destroy(); // clean up on unmount
    };
  }, [onChange, value]);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          name={name}
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder={placeholder}
          readOnly
          value={value}
        />

        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOne;
