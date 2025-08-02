import { ContractType } from "@/types/types";
import React, { useState, useRef, useEffect } from "react";

interface SelectBuyerSellerProps {
  onSelect: (buyer: ContractType) => void;
}

const SelectBuyerSeller = ({ onSelect }: SelectBuyerSellerProps) => {
  const brokerAge: ContractType[] = [
    { id: 1, name: "Seller" },
    { id: 2, name: "Buyer" },
    { id: 3, name: "Buyer & Seller" },
    { id: 4, name: "No Brokerage Payable" },
  ];

  const [selectedBuyer, setSelectedBuyer] = useState<ContractType | null>(null);
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
  const handleSelectBuyer = (brokerAge: ContractType) => {
    setSelectedBuyer(brokerAge);
    onSelect(brokerAge);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div ref={dropdownRef}>
      <div className="relative">
        <label className="block text-xs text-gray-700 uppercase">
          BROKERAGE PAYABLE BY
        </label>

        {/* Custom select button */}
        <div className="relative mt-1">
          <button
            type="button"
            className="block w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedBuyer ? selectedBuyer.name : "Select option"}
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
              {brokerAge.map((brokerAge: ContractType) => (
                <div
                  key={brokerAge.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedBuyer?.id === brokerAge.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSelectBuyer(brokerAge)}
                >
                  {brokerAge.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectBuyerSeller;
