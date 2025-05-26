"use client";
import { useState, useRef, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";

interface Buyer {
  id: number;
  name: string;
}

interface BuyerSelectProps {
  onSelect: (buyer: Buyer) => void;
}

const SellerSelect = ({ onSelect }: BuyerSelectProps) => {
  // Sample initial buyers data with proper typing
  const initialBuyers: Buyer[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Acme Corporation" },
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
    onSelect(buyer); // Pass the selected buyer back to parent
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 uppercase">
        SELLER
      </label>

      {/* Custom select button */}
      <div className="relative mt-1">
        <button
          type="button"
          className="block w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedBuyer ? selectedBuyer.name : "Select Seller"}
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
          {/* Buyer options */}
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

          {/* Add new buyer section */}
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center"
              onClick={() => {
                // Handle add new seller logic here
                setIsDropdownOpen(false);
              }}
            >
              <IoIosAdd />
              Add New Seller
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSelect;
