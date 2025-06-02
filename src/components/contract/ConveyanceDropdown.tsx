"use client";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

interface ConveyanceDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const ConveyanceDropdown = ({ value, onChange }: ConveyanceDropdownProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const conveyanceOptions = [
    { value: "Port Zone", name: "Port Zone" },
    { value: "Del MZ", name: "Del MZ" },
    { value: "Del Destination", name: "Del Destination" },
    { value: "Free On Truck", name: "Free On Truck" },
    { value: "Ex-Farm", name: "Ex-Farm" },
    { value: "Track", name: "Track" },
    { value: "Delivered Site", name: "Delivered Site" },
    { value: "Free In Store", name: "Free In Store" },
    { value: "DCT", name: "DCT" },
    { value: "FOB", name: "FOB" },
  ];

  return (
    <div className="flex border-b border-gray-300">
      <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">CONVEYANCE</div>
      <div className="w-1/2 p-3 relative">
        <div
          className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
        >
          <span>
            {conveyanceOptions.find((opt) => opt.value === value)?.name ||
              "Select Conveyance"}
          </span>
          <MdArrowDropDown className="text-xl" />
        </div>
        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
            {conveyanceOptions.map((option) => (
              <div
                key={option.value}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setShowDropdown(false);
                }}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConveyanceDropdown;
