/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { TContract } from "@/types/types";

type FilterOption = {
  id: string;
  label: string;
  field: keyof TContract | ((contract: TContract) => string);
};

interface SearchFilterBarProps {
  data: TContract[];
  onFilterChange: (filteredData: TContract[]) => void;
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
      field: (contract) => contract.seller?.mainNgr || "",
    },
    {
      id: "commodity",
      label: "Commodity",
      field: "season",
    },
    {
      id: "seller",
      label: "Seller",
      field: (contract) => contract.seller?.legalName || "",
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
      label: "Contract Number",
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

  // Apply filters to data - FIXED: Removed onFilterChange from dependencies
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

            let fieldValue;
            if (typeof filterOption.field === "function") {
              fieldValue = filterOption.field(contract);
            } else {
              fieldValue = contract[filterOption.field];
            }

            // Add null/undefined check
            return (
              fieldValue &&
              String(fieldValue)
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
          });
        });
      }
    }

    onFilterChange(filteredData);
  }, [searchTerm, selectedFilters, data]); // Removed onFilterChange from dependencies

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
          <div className="grid xl:grid-cols-4 grid-cols-2 gap-5 p-4">
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
