"use client";
import { Buyer, Contract, Note, Seller } from "@/types/types";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoFilterSharp } from "react-icons/io5";
import { RiDeleteBin6Fill, RiResetLeftFill } from "react-icons/ri";

interface DeletedItem {
  id: string;
  name: string;
  noteName: string;
  sellerLegalName: string;
  contractNumber: string;
  type: "Contract" | "Note" | "Seller" | "Buyer";
  isDeleted: boolean;
  deletedAt: string;
}

const RubbishBin = () => {
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    ("Contract" | "Note" | "Seller" | "Buyer")[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch contracts data
        const contractsRes = await fetch("contracts.json");
        const contracts = await contractsRes.json();

        // Fetch notes data
        const notesRes = await fetch("notes.json");
        const notes = await notesRes.json();

        // Fetch sellers data
        const sellersRes = await fetch("seller.json");
        const sellers = await sellersRes.json();

        // Fetch buyers data
        const buyersRes = await fetch("buyer.json");
        const buyers = await buyersRes.json();

        // Process and combine all data
        const allItems = [
          ...contracts.map((c: Contract) => ({ ...c, type: "Contract" })),
          ...notes.map((n: Note) => ({ ...n, type: "Note" })),
          ...sellers.map((s: Seller) => ({ ...s, type: "Seller" })),
          ...buyers.map((b: Buyer) => ({ ...b, type: "Buyer" })),
        ];

        // Filter only deleted items
        const deleted = allItems.filter((item) => item.isDeleted);
        setDeletedItems(deleted);
        setFilteredItems(deleted);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredItems(deletedItems);
    } else {
      setFilteredItems(
        deletedItems.filter((item) => activeFilters.includes(item.type))
      );
    }
  }, [activeFilters, deletedItems]);

  const toggleFilter = (type: "Contract" | "Note" | "Seller" | "Buyer") => {
    if (activeFilters.includes(type)) {
      setActiveFilters(activeFilters.filter((t) => t !== type));
    } else {
      setActiveFilters([...activeFilters, type]);
    }
  };

  const columns = [
    {
      name: "NAME",
      selector: (row: DeletedItem) =>
        row.name || row.sellerLegalName || row.contractNumber || row.noteName,
      sortable: true,
    },
    {
      name: "TYPE",
      selector: (row: DeletedItem) => row.type,
      sortable: true,
    },
    {
      name: "DATE ADDED",
      selector: (row: DeletedItem) =>
        new Date(row.deletedAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#E8F2FF",
        },
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #ddd",
        padding: "12px",
      },
    },
    headCells: {
      style: {
        borderRight: "1px solid #ddd",
        fontWeight: "bold",
        color: "gray",
        padding: "12px",
      },
    },
  };

  return (
    <div className="mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
        {/* Create New Buyer Button */}
        <div className="w-full md:w-auto">
          <p className="text-lg font-semibold text-gray-800">Rubbish bin</p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm">
          <button>Empty Rubbish Bin</button>
        </div>
      </div>
      <div className="mt-3">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <h2 className="font-semibold text-gray-800">
              List of deleted items
            </h2>
            <p className="text-sm text-gray-500">
              {filteredItems.length} deleted items found
              {activeFilters.length > 0 &&
                ` (filtered by ${activeFilters.join(", ")})`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2 relative">
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <RiResetLeftFill />
              Restore
            </button>
            <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <RiDeleteBin6Fill className="text-red-500" />
              Permanent Delete
            </button>
            <div className="relative">
              <button
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <IoFilterSharp />
                Filter
                {activeFilters.length > 0 && ` (${activeFilters.length})`}
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <div
                      className={`px-4 py-2 text-sm cursor-pointer rounded ${
                        activeFilters.includes("Contract")
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleFilter("Contract")}
                    >
                      Contracts
                    </div>
                    <div
                      className={`px-4 py-2 text-sm cursor-pointer rounded ${
                        activeFilters.includes("Note")
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleFilter("Note")}
                    >
                      Notes
                    </div>
                    <div
                      className={`px-4 py-2 text-sm cursor-pointer rounded ${
                        activeFilters.includes("Seller")
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleFilter("Seller")}
                    >
                      Sellers
                    </div>
                    <div
                      className={`px-4 py-2 text-sm cursor-pointer rounded ${
                        activeFilters.includes("Buyer")
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleFilter("Buyer")}
                    >
                      Buyers
                    </div>
                    {activeFilters.length > 0 && (
                      <div
                        className="px-4 py-2 text-sm cursor-pointer rounded hover:bg-gray-100 text-blue-500"
                        onClick={() => setActiveFilters([])}
                      >
                        Clear all filters
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-auto border border-gray-200">
          <DataTable
            columns={columns}
            data={filteredItems}
            progressPending={loading}
            selectableRows
            pagination
            highlightOnHover
            noDataComponent={<div className="p-4">No deleted items found</div>}
            fixedHeader
            fixedHeaderScrollHeight="500px"
            selectableRowsHighlight
            responsive
            pointerOnHover
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default RubbishBin;
