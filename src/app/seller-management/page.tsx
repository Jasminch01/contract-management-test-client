"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp, IoWarning } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { Seller } from "@/types/types";
import toast, { Toaster } from "react-hot-toast";
import { sellers } from "@/data/data";

const columns = [
  {
    name: "SELLER NAME",
    selector: (row: Seller) => row.sellerLegalName,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Seller) => row.sellerABN,
    sortable: true,
  },
  {
    name: "MAIN CONTACT",
    selector: (row: Seller) => row.sellerContactName,
    sortable: true,
  },
  {
    name: "EMAIL",
    selector: (row: Seller) => row.sellerEmail,
    sortable: true,
  },
  {
    name: "PHONE",
    selector: (row: Seller) => row.sellerPhoneNumber,
    sortable: true,
  },
  {
    name: "CREATED DATE",
    selector: (row: Seller) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
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
      padding: "12px 15px",
    },
  },
  headCells: {
    style: {
      borderRight: "1px solid #ddd",
      fontWeight: "bold",
      color: "gray",
      padding: "12px 15px",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #ddd",
    },
  },
};

const SellerManagementPage = () => {
  const [data, setData] = useState<Seller[]>(
    sellers
      .filter((s) => !s.isDeleted)
      .map((seller) => ({
        ...seller,
        // Adding createdAt field if it doesn't exist (for demo purposes)
        createdAt:
          seller.createdAt ||
          new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toISOString(),
      }))
  );
  const [filteredData, setFilteredData] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Seller[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all"); // "all", "today", "lastWeek"
  const router = useRouter();

  // Filter options for date filter dropdown
  const dateFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Recent" },
    { value: "lastWeek", label: "Last Week" },
  ];

  useEffect(() => {
    // Apply both search and date filters
    let result = data;

    // Apply date filter
    if (dateFilter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((seller) => {
        const createdDate = new Date(seller.createdAt);
        return createdDate >= today;
      });
    } else if (dateFilter === "lastWeek") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      result = result.filter((seller) => {
        const createdDate = new Date(seller.createdAt);
        return createdDate >= lastWeek;
      });
    }

    // Apply search filter (by ABN or company name)
    if (searchTerm) {
      result = result.filter((seller) => {
        return (
          seller.sellerLegalName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          seller.sellerABN?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredData(result);
  }, [searchTerm, dateFilter, data]);

  const handleRowClicked = (row: Seller) => {
    router.push(`/seller-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Seller[];
  }) => {
    setSelectedRows(selected.selectedRows);
  };

  const handleEdit = () => {
    if (selectedRows.length === 0) {
      toast("Please select at least one seller to edit");
      return;
    }
    if (selectedRows.length > 1) {
      toast("Please select only one seller to edit");
      return;
    }
    router.push(`/seller-management/edit/${selectedRows[0].id}`);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast("Please select at least one seller to delete");
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const newData = data.filter(
      (item) => !selectedRows.some((row) => row.id === item.id)
    );
    setData(newData);
    setSelectedRows([]);
    setFilteredData(newData);
    setToggleCleared(!toggleCleared);
    setIsDeleteConfirmOpen(false);
    toast.success(`${selectedRows.length} seller(s) deleted successfully`);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setIsFilterOpen(false);
  };

  const clearDateFilter = () => {
    setDateFilter("all");
    setIsFilterOpen(false);
  };

  return (
    <div className="mt-20">
      <Toaster />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-300 pb-5 px-4">
        {/* Create New Seller Button */}
        <div className="w-full md:w-auto">
          <Link href={`/seller-management/create-seller`}>
            <button className="w-full md:w-auto px-4 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors shadow-sm">
              Create New Seller
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full xl:w-[30rem] md:w-64 lg:w-80  px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search Seller by Name, ABN"
            className="w-full focus:outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <LuSearch className="text-gray-500" />
        </div>
      </div>
      <div className="mt-3">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold text-gray-800">
              List of Sellers
            </h2>
            <p className="text-sm text-gray-500">
              {filteredData.length} seller(s) found
              {dateFilter !== "all" && (
                <span>
                  {" "}
                  •{" "}
                  {dateFilter === "today"
                    ? "Created today"
                    : "Created last week"}
                </span>
              )}
            </p>
          </div>
          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2">
            <button
              onClick={handleEdit}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              <MdOutlineEdit />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RiDeleteBin6Fill className="text-red-500" />
              Delete
            </button>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={handleFilter}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              >
                <IoFilterSharp />
                Filter
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-3">
                    <p className="font-medium text-gray-700">
                      Filter by Creation Date
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {dateFilterOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`px-4 py-2 text-sm cursor-pointer flex items-center ${
                          dateFilter === option.value
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleDateFilterChange(option.value)}
                      >
                        <span className="flex-grow">{option.label}</span>
                        {dateFilter === option.value && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>

                  {dateFilter !== "all" && (
                    <div
                      className="border-t border-gray-200 px-4 py-2 text-sm cursor-pointer text-red-500 hover:bg-red-50 flex items-center justify-between"
                      onClick={clearDateFilter}
                    >
                      <span>Clear filter</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-auto border border-gray-200 shadow-sm">
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={customStyles}
            onRowClicked={handleRowClicked}
            selectableRows
            onSelectedRowsChange={handleChange}
            clearSelectedRows={toggleCleared}
            fixedHeader
            fixedHeaderScrollHeight="500px"
            responsive
            pagination
            pointerOnHover
            selectableRowsHighlight
            highlightOnHover
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="px-5 py-3 border-b border-[#D3D3D3]">
              <h3 className="text-lg font-semibold flex gap-x-5 items-center">
                <IoWarning color="red" />
                Delete selected sellers?
              </h3>
            </div>
            <div className="mt-5 px-5 pb-5">
              <p className="mb-4 text-center">
                Are you sure you want to delete {selectedRows.length} selected
                seller(s)? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-[#BF3131] text-white rounded hover:bg-[#ff7e7e]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagementPage;
