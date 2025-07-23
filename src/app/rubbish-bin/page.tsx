"use client";
import { Buyer, Contract, Seller } from "@/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoFilterSharp } from "react-icons/io5";
import { RiDeleteBin6Fill, RiResetLeftFill } from "react-icons/ri";

type DeletedItem =
  | (Buyer & { type: "Buyer" })
  | (Seller & { type: "Seller" })
  | (Contract & { type: "Contract" });

const RubbishBin = () => {
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    ("Contract" | "Seller" | "Buyer")[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<DeletedItem[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  // Simple notification system
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type: "", visible: false });
    }, 3000);
  };

  console.log("Deleted Items:", deletedItems);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/api/trash`);

        // Get the data from response
        const deletedBuyers = res.data?.buyers || [];
        const deletedSellers = res.data?.sellers || [];
        const deletedContracts = res.data?.contracts || [];

        // Process and combine all data
        const allItems: DeletedItem[] = [
          ...deletedContracts.map((c: Contract) => ({
            ...c,
            type: "Contract" as const,
          })),
          ...deletedSellers.map((s: Seller) => ({
            ...s,
            type: "Seller" as const,
          })),
          ...deletedBuyers.map((b: Buyer) => ({
            ...b,
            type: "Buyer" as const,
          })),
        ];

        // Set the combined deleted items
        setDeletedItems(allItems);
        setFilteredItems(allItems);
      } catch (error) {
        console.error("Error loading data:", error);
        showNotification("Error loading deleted items", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Remove dependencies to prevent infinite loop

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredItems(deletedItems);
    } else {
      setFilteredItems(
        deletedItems.filter((item) => activeFilters.includes(item.type))
      );
    }
  }, [activeFilters, deletedItems]);

  const toggleFilter = (type: "Contract" | "Seller" | "Buyer") => {
    if (activeFilters.includes(type)) {
      setActiveFilters(activeFilters.filter((t) => t !== type));
    } else {
      setActiveFilters([...activeFilters, type]);
    }
  };

  const handleRowSelected = (state: { selectedRows: DeletedItem[] }) => {
    setSelectedRows(state.selectedRows);
  };

  const handlePermanentDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmPermanentDelete = async() => {
    setDeleteInProgress(true);

    
    // Simulate API call delay
    setTimeout(() => {
      // Filter out the selected rows from the deletedItems
      const updatedItems = deletedItems.filter(
        (item) =>
          !selectedRows.some((selectedItem) => selectedItem._id === item._id)
      );

      setDeletedItems(updatedItems);
      setSelectedRows([]);
      setDeleteInProgress(false);
      setShowDeleteModal(false);

      // Show success notification
      showNotification(
        "Selected items permanently deleted successfully",
        "success"
      );
    }, 1500);
  };

  const cancelPermanentDelete = () => {
    setShowDeleteModal(false);
  };

  const emptyRubbishBin = async () => {
    const res = await axios.delete(`http://localhost:8000/api/trash/bulk`);
    if (res.data) {
      showNotification("Rubbish bin is already empty", "info");
      return;
    }
    if (deletedItems.length === 0) {
    }

    // Simulate API call delay
    // setTimeout(() => {
    //   setDeletedItems([]);
    //   setSelectedRows([]);
    //   showNotification("Rubbish bin emptied successfully", "success");
    // }, 1000);
  };

  const columns = [
    {
      name: "NAME",
      selector: (row: DeletedItem) => {
        if (row.type === "Buyer") {
          return (row as Buyer).name;
        } else if (row.type === "Seller") {
          return (row as Seller).legalName;
        } else {
          return (row as Contract).contractNumber || "Contract";
        }
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "TYPE",
      selector: (row: DeletedItem) => row.type,
      sortable: true,
      width: "100px",
    },
    {
      name: "EMAIL",
      selector: (row: DeletedItem) => {
        if (row.type === "Buyer" || row.type === "Seller") {
          return (row as Buyer | Seller).email;
        }
        return "N/A";
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "PHONE",
      selector: (row: DeletedItem) => {
        if (row.type === "Buyer" || row.type === "Seller") {
          return (row as Buyer | Seller).phoneNumber || "N/A";
        }
        return "N/A";
      },
      sortable: true,
    },
    {
      name: "ABN",
      selector: (row: DeletedItem) => {
        if (row.type === "Buyer" || row.type === "Seller") {
          return (row as Buyer | Seller).abn;
        }
        return "N/A";
      },
      sortable: true,
    },
    {
      name: "DELETED AT",
      selector: (row: DeletedItem) => {
        const deletedAt = row.deletedAt;
        return deletedAt ? new Date(deletedAt).toLocaleDateString() : "N/A";
      },
      sortable: true,
      format: (row: DeletedItem) => {
        const deletedAt = row.deletedAt;
        return deletedAt ? new Date(deletedAt).toLocaleString() : "N/A";
      },
      width: "150px",
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
        {/* Title */}
        <div className="w-full md:w-auto">
          <p className="text-lg font-semibold text-gray-800">Rubbish bin</p>
        </div>

        {/* Empty Bin Button */}
        <div className="w-full md:w-auto">
          <button
            onClick={emptyRubbishBin}
            className="px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm hover:bg-gray-50"
          >
            <RiDeleteBin6Fill className="text-red-500" />
            Empty Rubbish Bin
          </button>
        </div>
      </div>

      <div className="">
        {/* Summary Cards */}
        <div className="mb-4 p-4 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {deletedItems.filter((item) => item.type === "Buyer").length}
              </div>
              <div className="text-sm text-gray-600">Deleted Buyers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {deletedItems.filter((item) => item.type === "Seller").length}
              </div>
              <div className="text-sm text-gray-600">Deleted Sellers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {deletedItems.filter((item) => item.type === "Contract").length}
              </div>
              <div className="text-sm text-gray-600">Deleted Contracts</div>
            </div>
          </div>
        </div>

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
                ` (filtered by ${activeFilters?.join(", ")})`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2 relative">
            <button
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm transition-colors shadow-sm ${
                selectedRows.length > 0
                  ? "cursor-pointer hover:bg-gray-50"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={selectedRows.length === 0}
            >
              <RiResetLeftFill />
              Restore
            </button>
            <button
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm transition-colors shadow-sm ${
                selectedRows.length > 0
                  ? "cursor-pointer hover:bg-gray-50"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handlePermanentDelete}
              disabled={selectedRows.length === 0}
            >
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
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={deleteInProgress}
          />
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
                Permanently Delete Items
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Are you sure you want to permanently delete{" "}
                {selectedRows.length} selected item(s)? This action cannot be
                undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelPermanentDelete}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={deleteInProgress}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPermanentDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={deleteInProgress}
                >
                  {deleteInProgress ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}

        {notification.visible && (
          <div className="fixed bottom-4 right-4 max-w-md z-50">
            <div
              className={`rounded-md shadow-lg p-4 ${
                notification.type === "success"
                  ? "bg-green-50 border-l-4 border-green-500"
                  : notification.type === "error"
                  ? "bg-red-50 border-l-4 border-red-500"
                  : "bg-blue-50 border-l-4 border-blue-500"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 ${
                    notification.type === "success"
                      ? "text-green-500"
                      : notification.type === "error"
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                >
                  {notification.type === "success" ? (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : notification.type === "error" ? (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RubbishBin;
