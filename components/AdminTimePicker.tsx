"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Clock } from "lucide-react";
import { createPortal } from "react-dom";

interface AdminTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Tạo danh sách giờ từ 06:00 đến 22:00, bước 30 phút */
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 22) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

/** Phân loại giờ theo buổi */
function getCategory(time: string): string {
  const hour = parseInt(time.split(":")[0]);
  if (hour < 11) return "Sáng";
  if (hour < 14) return "Trưa";
  if (hour < 17) return "Chiều";
  return "Tối";
}

export default function AdminTimePicker({ value, onChange, placeholder = "Chọn giờ..." }: AdminTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopupPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        popupRef.current && !popupRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [isOpen]);

  function selectTime(t: string) {
    onChange(t);
    setIsOpen(false);
  }

  function clearTime() {
    onChange("");
    setIsOpen(false);
  }

  // Group by category
  const categories: { label: string; times: string[] }[] = [];
  let currentCat = "";
  for (const t of TIME_SLOTS) {
    const cat = getCategory(t);
    if (cat !== currentCat) {
      categories.push({ label: cat, times: [] });
      currentCat = cat;
    }
    categories[categories.length - 1].times.push(t);
  }

  const popupContent = isOpen ? createPortal(
    <div
      ref={popupRef}
      className="admin-timepicker-popup"
      style={{ position: "fixed", top: popupPos.top, left: popupPos.left, width: Math.max(popupPos.width, 280) }}
    >
      {categories.map((cat) => (
        <div key={cat.label} className="admin-timepicker-category">
          <div className="admin-timepicker-category-label">{cat.label}</div>
          <div className="admin-timepicker-grid">
            {cat.times.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => selectTime(t)}
                className={`admin-timepicker-cell ${value === t ? "admin-timepicker-cell-selected" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="admin-timepicker-footer">
        <button type="button" onClick={clearTime} className="admin-datepicker-clear">
          Dùng mặc định
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="admin-select">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="admin-select-trigger"
      >
        <span className={value ? "" : "admin-select-placeholder"}>
          {value || placeholder}
        </span>
        <Clock className={`admin-select-arrow ${isOpen ? "admin-select-arrow-open" : ""}`} />
      </button>
      {popupContent}
    </div>
  );
}
