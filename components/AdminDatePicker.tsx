"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { createPortal } from "react-dom";

interface AdminDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  weddingDate?: string; // ISO date of the wedding
}

const DAYS_OF_WEEK = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DAYS_OF_WEEK_FULL = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

function formatViDate(d: Date): string {
  const dayName = DAYS_OF_WEEK_FULL[d.getDay()];
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dayName}, ngày ${dd} tháng ${mm} năm ${yyyy}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Parse "Thứ Bảy, ngày 11 tháng 04 năm 2026" → Date */
function parseViDate(s: string): Date | null {
  const m = s.match(/ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})/);
  if (!m) return null;
  return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
}

export default function AdminDatePicker({ value, onChange, placeholder = "Chọn ngày...", weddingDate }: AdminDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const wedding = weddingDate ? new Date(weddingDate) : null;
  const parsedValue = value ? parseViDate(value) : null;
  const [viewMonth, setViewMonth] = useState(parsedValue?.getMonth() ?? wedding?.getMonth() ?? new Date().getMonth());
  const [viewYear, setViewYear] = useState(parsedValue?.getFullYear() ?? wedding?.getFullYear() ?? new Date().getFullYear());

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

  // Close on click outside
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

  // Generate calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ date: new Date(viewYear, viewMonth - 1, prevMonthDays - i), inMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(viewYear, viewMonth, i), inMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: new Date(viewYear, viewMonth + 1, i), inMonth: false });
  }

  function prevM() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function nextM() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  function selectDate(d: Date) {
    onChange(formatViDate(d));
    setIsOpen(false);
  }

  function clearDate() {
    onChange("");
    setIsOpen(false);
  }

  const today = new Date();

  const popupContent = isOpen ? createPortal(
    <div
      ref={popupRef}
      className="admin-datepicker-popup"
      style={{ position: "fixed", top: popupPos.top, left: popupPos.left, width: Math.max(popupPos.width, 320) }}
    >
      {/* Header */}
      <div className="admin-datepicker-header">
        <button type="button" onClick={prevM} className="admin-datepicker-nav">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="admin-datepicker-title">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextM} className="admin-datepicker-nav">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Days of week */}
      <div className="admin-datepicker-dow">
        {DAYS_OF_WEEK.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="admin-datepicker-grid">
        {cells.map((cell, i) => {
          const isSelected = parsedValue && isSameDay(cell.date, parsedValue);
          const isWedding = wedding && isSameDay(cell.date, wedding);
          const isToday = isSameDay(cell.date, today);

          return (
            <button
              key={i}
              type="button"
              onClick={() => selectDate(cell.date)}
              className={[
                "admin-datepicker-cell",
                !cell.inMonth && "admin-datepicker-cell-dim",
                isSelected && "admin-datepicker-cell-selected",
                isWedding && !isSelected && "admin-datepicker-cell-wedding",
                isToday && !isSelected && !isWedding && "admin-datepicker-cell-today",
              ].filter(Boolean).join(" ")}
              title={isWedding ? "Ngày cưới ★" : formatViDate(cell.date)}
            >
              {cell.date.getDate()}
              {isWedding && <span className="admin-datepicker-star">★</span>}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="admin-datepicker-footer">
        <button type="button" onClick={clearDate} className="admin-datepicker-clear">
          Dùng mặc định
        </button>
        {wedding && (
          <button type="button" onClick={() => selectDate(wedding)} className="admin-datepicker-wedding-btn">
            Ngày cưới ★
          </button>
        )}
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
        <Calendar className={`admin-select-arrow ${isOpen ? "admin-select-arrow-open" : ""}`} />
      </button>
      {popupContent}
    </div>
  );
}
