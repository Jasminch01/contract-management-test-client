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
  const [selectedRows, setSelectedRows] = useState<DeletedItem[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

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

  const handleRowSelected = (state: { selectedRows: DeletedItem[] }) => {
    setSelectedRows(state.selectedRows);
  };

  const handlePermanentDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmPermanentDelete = () => {
    setDeleteInProgress(true);

    // Simulate API call delay
    setTimeout(() => {
      // Filter out the selected rows from the deletedItems
      const updatedItems = deletedItems.filter(
        (item) =>
          !selectedRows.some((selectedItem) => selectedItem.id === item.id)
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

  const emptyRubbishBin = () => {
    if (deletedItems.length === 0) {
      showNotification("Rubbish bin is already empty", "info");
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      setDeletedItems([]);
      setSelectedRows([]);
      showNotification("Rubbish bin emptied successfully", "success");
    }, 1000);
  };

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
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={deleteInProgress}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Permanent Delete
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete {selectedRows.length}{" "}
              selected item{selectedRows.length !== 1 ? "s" : ""}? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelPermanentDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={deleteInProgress}
              >
                Cancel
              </button>
              <button
                onClick={confirmPermanentDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                disabled={deleteInProgress}
              >
                {deleteInProgress ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    Deleting...
                  </>
                ) : (
                  <>
                    <RiDeleteBin6Fill />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
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
  );
};

export default RubbishBin;
