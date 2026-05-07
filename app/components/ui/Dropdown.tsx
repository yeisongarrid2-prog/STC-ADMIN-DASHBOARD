"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  width?: string;
}

export function Dropdown({ trigger, children, align = "right", width = "w-48" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex items-center">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-[100] mt-1.5 ${width} rounded-xl bg-white shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div className="py-1.5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ 
  children, 
  onClick, 
  danger 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  danger?: boolean; 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 ${
        danger 
          ? "text-red-600 hover:bg-red-50" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="h-px bg-gray-100 my-1.5 mx-2" />;
}
