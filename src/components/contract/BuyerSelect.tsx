"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoIosAdd } from "react-icons/io";
import { getBuyers } from "@/api/buyerApi";
import { Buyer } from "@/types/types";
import { useRouter } from "next/navigation";

interface BuyerSelectProps {
  onSelect: (buyer: Buyer) => void;
}

const BuyerSelect = ({ onSelect }: BuyerSelectProps) => {
  // State management with proper types
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // TanStack Query to fetch buyers
  const {
    data: buyers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["buyers"],
    queryFn: getBuyers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

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
  const router = useRouter();
  // Handle selecting a buyer
  const handleSelectBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsDropdownOpen(false);
    onSelect(buyer); // Pass the selected buyer back to parent
  };

  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs text-gray-700 uppercase">Buyer *</label>

      {/* Custom select button */}
      <div className="relative mt-1">
        <button
          type="button"
          className="block w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading}
        >
          {isLoading
            ? "Loading buyers..."
            : selectedBuyer
            ? selectedBuyer.name
            : "Select Buyer"}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
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
            )}
          </span>
        </button>
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Error state */}
          {isError && (
            <div className="p-4 text-center">
              <p className="text-red-600 text-sm mb-2">Failed to load buyers</p>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
                onClick={handleRetry}
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">Loading buyers...</p>
            </div>
          )}

          {/* Buyer options */}
          {!isLoading && !isError && (
            <>
              <div className="max-h-60 overflow-y-auto">
                {buyers.length > 0 ? (
                  buyers.map((buyer: Buyer) => (
                    <div
                      key={buyer._id}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        selectedBuyer?._id === buyer._id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleSelectBuyer(buyer)}
                    >
                      {buyer.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    No buyers found
                  </div>
                )}
              </div>

              {/* Add new buyer section */}
              <div className="p-2 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center"
                  onClick={() => {
                    // Handle add new buyer logic here
                    setIsDropdownOpen(false);
                    router.push("/dashboard/buyer-management/create-buyer");
                  }}
                >
                  <IoIosAdd />
                  Add New Buyer
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerSelect;
