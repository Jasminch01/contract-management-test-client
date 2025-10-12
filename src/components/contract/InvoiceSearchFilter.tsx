/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
// import { IoIosClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

interface InvoiceSearchFilterProps {
  onFilterChange: (filters: {
    searchFilters: Record<string, string>;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export default function InvoiceSearchFilter({
  onFilterChange,
}: InvoiceSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // const [dateFrom, setDateFrom] = useState("");
  // const [dateTo, setDateTo] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filterOptions = [
    {
      id: "contractNumber",
      label: "Contract Number",
    },
    {
      id: "seller",
      label: "Seller",
    },
    {
      id: "buyer",
      label: "Buyer",
    },
    {
      id: "ngr",
      label: "NGR",
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
        applyFilters();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchTerm, selectedFilters]);

  const applyFilters = () => {
    const searchFilters: Record<string, string> = {};
    
    if (searchTerm && selectedFilters.length > 0) {
      selectedFilters.forEach(filterId => {
        searchFilters[filterId] = searchTerm;
      });
    } else if (searchTerm && selectedFilters.length === 0) {
      searchFilters.contractNumber = searchTerm;
    }
    
    onFilterChange({
      searchFilters,
      // dateFrom: dateFrom || undefined,
      // dateTo: dateTo || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
      inputRef.current?.blur();
    }
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  // const clearAllFilters = () => {
  //   setSelectedFilters([]);
  //   setSearchTerm("");
  //   setDateFrom("");
  //   setDateTo("");
  //   onFilterChange({ searchFilters: {} });
  // };

  // const hasActiveFilters = searchTerm || selectedFilters.length > 0 || dateFrom || dateTo;

  return (
    <div className="w-full relative">
      {/* Search Bar */}
      <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="flex items-center px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search invoiced contracts by contract number, seller, buyer, or NGR..."
            className="w-full focus:outline-none text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onKeyPress={handleKeyPress}
            onBlur={applyFilters}
          />
          <LuSearch className="cursor-pointer text-gray-400" />
        </div>
      </div>

      {/* Filter Dropdown Panel */}
      {isInputFocused && (
        <div
          ref={filterRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          {/* <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium text-base mr-2">Filter</span>
                {(selectedFilters.length > 0 || dateFrom || dateTo) && (
                  <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-sm">
                    {selectedFilters.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Clear all
                  <IoIosClose className="text-2xl" />
                </button>
              )}
            </div>
          </div> */}

          {/* Search By Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Search By</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filterOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => toggleFilter(option.id)}
                  className={`border rounded-lg p-2 px-3 flex items-center cursor-pointer transition-colors ${
                    selectedFilters.includes(option.id)
                      ? "bg-blue-50 border-blue-400 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50"
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
            {selectedFilters.length === 0 && searchTerm && (
              <p className="text-xs text-gray-500 mt-2">
                Default: Searching by Contract Number
              </p>
            )}
          </div>

          {/* Date Filter Section */}
          {/* <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Date</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setTimeout(applyFilters, 300);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setTimeout(applyFilters, 300);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            {(dateFrom || dateTo) && (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  {dateFrom && dateTo
                    ? `Filtering from ${new Date(dateFrom).toLocaleDateString()} to ${new Date(dateTo).toLocaleDateString()}`
                    : dateFrom
                    ? `Filtering from ${new Date(dateFrom).toLocaleDateString()}`
                    : `Filtering to ${new Date(dateTo).toLocaleDateString()}`}
                </p>
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setTimeout(applyFilters, 100);
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Clear dates
                </button>
              </div>
            )}
          </div> */}
        </div>
      )}
    </div>
  );
}