/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { Contract } from "@/types/types";
import { IoIosClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

type FilterOption = {
  id: string;
  label: string;
  field: keyof Contract | ((contract: Contract) => string);
};

interface SearchFilterBarProps {
  data: Contract[];
  onFilterChange: (filteredData: Contract[]) => void;
}

export default function SearchFilterBar({
  data,
  onFilterChange,
}: SearchFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filterOptions: FilterOption[] = [
    {
      id: "ngr",
      label: "NGR",
      field: (contract) => contract.seller.sellerMainNGR,
    },
    {
      id: "commodity",
      label: "Commodity",
      field: "commoditySeason",
    },
    {
      id: "grower",
      label: "Grower",
      field: (contract) => contract.seller.sellerLegalName,
    },
    {
      id: "grade",
      label: "Grade",
      field: "grade",
    },
    {
      id: "tonnes",
      label: "Tonnes",
      field: "tonnes",
    },
    {
      id: "contractNumber",
      label: "Contract number",
      field: "contractNumber",
    },
  ];

  // Handle click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply filters to data
  useEffect(() => {
    if (!searchTerm && selectedFilters.length === 0) {
      onFilterChange(data);
      return;
    }

    let filteredData = data;

    if (searchTerm) {
      if (selectedFilters.length === 0) {
        // If no filter selected, search in contract number by default
        filteredData = filteredData.filter((contract) =>
          contract.contractNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      } else {
        // Search in selected fields
        filteredData = filteredData.filter((contract) => {
          return selectedFilters.some((filterId) => {
            const filterOption = filterOptions.find(
              (option) => option.id === filterId
            );
            if (!filterOption) return false;

            const fieldValue =
              typeof filterOption.field === "function"
                ? filterOption.field(contract)
                : contract[filterOption.field as keyof Contract];

            return String(fieldValue)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          });
        });
      }
    }

    onFilterChange(filteredData);
  }, [searchTerm, selectedFilters, data, onFilterChange, filterOptions]);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setSearchTerm("");
  };

  return (
    <div className="w-full relative">
      {/* Search Bar */}
      <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="flex items-center px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Contract"
            className="w-full focus:outline-none text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
          />
          <LuSearch />
        </div>
      </div>

      {/* Filter Dropdown Panel */}
      {isInputFocused && (
        <div
          ref={filterRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium text-base mr-2">Filter</span>
                {selectedFilters.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-sm">
                    {selectedFilters.length}
                  </span>
                )}
              </div>
              {selectedFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Clear all
                  <IoIosClose className="text-2xl" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Options Grid */}
          <div className="grid xl:grid-cols-4 gird-cols-2 gap-5 p-4">
            {filterOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => toggleFilter(option.id)}
                className={`border rounded-lg p-2 px-3 flex items-center cursor-pointer transition-colors ${
                  selectedFilters.includes(option.id)
                    ? "bg-blue-50 border-blue-400 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50"
                } ${
                  option.id === "contractNumber"
                    ? "w-36"
                    : "w-auto min-w-[112px]"
                }`}
              >
                <div
                  className={`size-3 rounded-full border flex items-center justify-center mr-3 ${
                    selectedFilters.includes(option.id)
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedFilters.includes(option.id) && (
                    <FaCheck className="text-xs text-white" />
                  )}
                </div>
                <p className="text-xs">{option.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
