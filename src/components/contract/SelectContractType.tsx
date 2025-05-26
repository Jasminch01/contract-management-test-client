import React, { useState, useRef, useEffect } from "react";

interface Buyer {
  id: number;
  name: string;
}

interface SelectContractTypeProps {
  onSelect: (buyer: Buyer) => void;
}

const SelectContractType = ({ onSelect }: SelectContractTypeProps) => {
  const initialBuyers: Buyer[] = [
    { id: 1, name: "Grower" },
    { id: 2, name: "Trade" },
  ];

  // State management with proper types
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
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

  // Handle selecting a buyer
  const handleSelectBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsDropdownOpen(false);
    onSelect(buyer); // Pass the selected option to parent
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 uppercase">
        CONTRACT TYPE
      </label>

      {/* Custom select button */}
      <div className="relative mt-1">
        <button
          type="button"
          className="block w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedBuyer ? selectedBuyer.name : "Select contract type"}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
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

      {/* Clear selection button (only shows when there's a selection) */}
      {selectedBuyer && (
        <button
          type="button"
          className="absolute right-0 top-7 mt-1 mr-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={() => {
            setSelectedBuyer(null);
            onSelect({ id: 0, name: "" });
          }}
        >
          ×
        </button>
      )}

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Contract type options */}
          <div className="max-h-60 overflow-y-auto">
            {initialBuyers.map((buyer: Buyer) => (
              <div
                key={buyer.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedBuyer?.id === buyer.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectBuyer(buyer)}
              >
                {buyer.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectContractType;
