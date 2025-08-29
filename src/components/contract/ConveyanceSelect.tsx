"use client";
import { ConveyanceOption } from "@/types/types";
import { useState, useRef, useEffect } from "react";

interface ConveyanceSelectProps {
  onValueChange: (value: string) => void; // Changed from onChange to onValueChange
  value: string;
}

const ConveyanceSelect = ({ onValueChange, value }: ConveyanceSelectProps) => {
  // Conveyance options data
  const initialOptions: ConveyanceOption[] = [
    { id: 1, value: "Port Zone", label: "Port Zone" },
    { id: 2, value: "Del MZ", label: "Del MZ" },
    { id: 3, value: "Del Destination", label: "Del Destination" },
    { id: 4, value: "Free On Truck", label: "Free On Truck" },
    { id: 5, value: "Ex-Farm", label: "Ex-Farm" },
    { id: 6, value: "Track", label: "Track" },
    { id: 7, value: "Delivered Site", label: "Delivered Site" },
    { id: 8, value: "Free In Store", label: "Free In Store" },
    { id: 9, value: "DCT", label: "DCT" },
    { id: 10, value: "FOB", label: "FOB" },
  ];

  // State management
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get the selected option label
  const selectedOption = initialOptions.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-700 uppercase">
        CONVEYANCE *
      </label>

      {/* Custom select button */}
      <div className="relative mt-1">
        <button
          type="button"
          className="block w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedOption ? selectedOption.label : "Select an option"}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Conveyance options */}
          <div className="max-h-60 overflow-y-auto">
            {initialOptions.map((option: ConveyanceOption) => (
              <div
                key={option.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === option.value ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  onValueChange(option.value); // Changed to onValueChange
                  setIsDropdownOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConveyanceSelect;
