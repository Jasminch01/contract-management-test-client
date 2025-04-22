"use client";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";

interface Buyer {
  id: number;
  name: string;
}

const SellerLocationZone = () => {
  // Sample initial buyers data with proper typing
  const initialBuyers: Buyer[] = [
    { id: 1, name: "Eyre Peninsula" },
    { id: 2, name: "Northern Adelaide" },
    { id: 3, name: "Southern Adelaide" },
    { id: 4, name: "Riverland/Mallee" },
    { id: 5, name: "Victoria" },
  ];

  // State management with proper types Eyre Peninsula

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
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">
        SELLER LOCATION ZONE
      </label>

      {/* Search input and dropdown toggle */}
      <div className="relative mt-1">
        <input
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Search buyer..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setSelectedBuyer(null);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
        />

        {/* Clear selection or show dropdown icon */}
        {selectedBuyer ? (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSelectedBuyer(null);
              setSearchTerm("");
            }}
          >
            ×
          </button>
        ) : (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
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
              <div className="px-4 py-2 text-gray-500">No buyers found</div>
            )}
          </div>

          {/* Add new buyer section */}
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center"
            >
              <IoIosAdd />
              Add New Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerLocationZone;
