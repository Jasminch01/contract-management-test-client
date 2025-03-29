"use client"
import { useState } from "react";

interface Buyer {
  id: number;
  name: string;
}

const BuyerSelect = () => {
  // Sample initial buyers data with proper typing
  const initialBuyers: Buyer[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Acme Corporation" },
  ];

  // State management with proper types
  const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newBuyerName, setNewBuyerName] = useState<string>("");

  // Filter buyers based on search term
  const filteredBuyers = buyers.filter((buyer: Buyer) =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting a buyer
  const handleSelectBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setSearchTerm(buyer.name);
    setIsDropdownOpen(false);
  };

  // Handle adding a new buyer
  const handleAddBuyer = () => {
    if (newBuyerName.trim()) {
      const newBuyer: Buyer = {
        id: Date.now(), // Temporary ID
        name: newBuyerName.trim(),
      };
      setBuyers([...buyers, newBuyer]);
      handleSelectBuyer(newBuyer);
      setNewBuyerName("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 uppercase">
        BUYER
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
            {showAddForm ? (
              <div className="space-y-2">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Enter buyer name"
                    value={newBuyerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewBuyerName(e.target.value)
                    }
                    autoFocus
                  />
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-600 text-white rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    onClick={handleAddBuyer}
                  >
                    Add
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center"
                onClick={() => setShowAddForm(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Buyer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerSelect;
