"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface AdminSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export default function AdminSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  className = "",
}: AdminSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [isOpen]);

  return (
    <div ref={ref} className={`admin-select ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="admin-select-trigger"
      >
        <span className={selectedOption ? "" : "admin-select-placeholder"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`admin-select-arrow ${isOpen ? "admin-select-arrow-open" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="admin-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`admin-select-option ${option.value === value ? "admin-select-option-selected" : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4 text-gold shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
