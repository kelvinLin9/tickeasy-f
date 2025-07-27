import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TimeOnlyPickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  inputClassName?: string;
  disabled?: boolean;
}

// 生成時間選項，每15分鐘一個選項，分成兩列
const generateTimeOptions = () => {
  const morningOptions = [];
  const afternoonOptions = [];

  // 上午 (00:00 - 11:45)
  for (let hour = 0; hour < 12; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedMinute = minute.toString().padStart(2, "0");
      morningOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  // 下午 (12:00 - 23:45)
  for (let hour = 12; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedMinute = minute.toString().padStart(2, "0");
      afternoonOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  return { morningOptions, afternoonOptions };
};

const baseInputStyle = "min-w-[120px] px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";
const baseDropdownStyle = "absolute z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg";

export function TimeOnlyPicker({ value, onChange, placeholder = "選擇時間", inputClassName = "", disabled = false }: TimeOnlyPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { morningOptions, afternoonOptions } = generateTimeOptions();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // 更新下拉選單位置
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly
        placeholder={placeholder}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`${baseInputStyle} ${inputClassName} cursor-pointer`}
      />
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`${baseDropdownStyle} fixed`}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: inputRef.current?.offsetWidth,
            }}
          >
            <div className="sticky top-0 bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">上午</div>
            <ul>
              {morningOptions.map((time) => (
                <li key={time} onClick={() => handleSelect(time)} className="cursor-pointer px-2 py-1 text-sm hover:bg-gray-100">
                  {time}
                </li>
              ))}
            </ul>
            <div className="sticky top-0 bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">下午</div>
            <ul>
              {afternoonOptions.map((time) => (
                <li key={time} onClick={() => handleSelect(time)} className="cursor-pointer px-2 py-1 text-sm hover:bg-gray-100">
                  {time}
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
