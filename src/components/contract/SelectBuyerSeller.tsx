import React, { useState } from "react";

interface Buyer {
  id: number;
  name: string;
}

interface SelectBuyerSellerProps {
  onSelect: (buyer: Buyer) => void;
}

const SelectBuyerSeller = ({ onSelect }: SelectBuyerSellerProps) => {
  const initialBuyers: Buyer[] = [
    { id: 1, name: "Seller" },
    { id: 2, name: "Buyer" },
    { id: 3, name: "Buyer & Seller" },
    { id: 4, name: "No Brokerage Payable" },
  ];

  // State management with proper types
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Filter buyers based on search term
  const filteredBuyers = initialBuyers.filter((buyer: Buyer) =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting a buyer
  const handleSelectBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setSearchTerm(buyer.name);
    setIsDropdownOpen(false);

    // Call the onSelect prop to pass data to parent component
    onSelect(buyer);
  };

  return (
    <div>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 uppercase">
          BROKERAGE PAYABLE BY
        </label>

        {/* Search input and dropdown toggle */}
        <div className="relative mt-1">
          <input
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value);
              setSelectedBuyer(null);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Select option"
          />

          {/* Clear selection or show dropdown icon */}
          {selectedBuyer ? (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSelectedBuyer(null);
                setSearchTerm("");
                // Notify parent about deselection
                onSelect({ id: 0, name: "" });
              }}
            >
              ×
            </button>
          ) : (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
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
            </button>
          )}
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {/* Buyer suggestions */}
            <div className="max-h-60 overflow-y-auto">
              {filteredBuyers.length > 0 ? (
                filteredBuyers.map((buyer: Buyer) => (
                  <div
                    key={buyer.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectBuyer(buyer)}
                  >
                    {buyer.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectBuyerSeller;
