"use client";
import { initialBuyers } from "@/data/data";
import { Buyer } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import toast, { Toaster } from "react-hot-toast";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp, IoWarning } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "BUYER NAME",
    selector: (row: Buyer) => row.name,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Buyer) => row.abn,
    sortable: true,
  },
  {
    name: "MAIN CONTACT",
    selector: (row: Buyer) => row.contactName,
    sortable: true,
  },
  {
    name: "EMAIL",
    selector: (row: Buyer) => row.email,
    sortable: true,
  },
  {
    name: "PHONE",
    selector: (row: Buyer) => row.phone,
    sortable: true,
  },
];

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #ddd",
    },
  },
  headCells: {
    style: {
      borderRight: "1px solid #ddd",
      fontWeight: "bold",
      color: "gray",
    },
  },
  cells: {
    style: {
      borderRight: "1px solid #ddd",
      padding: "12px 15px",
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "#E8F2FF",
        cursor: "pointer",
      },
    },
  },
};

const BuyerManagementPage = () => {
  const [data, setData] = useState<Buyer[]>(
    initialBuyers.filter((b) => !b.isDeleted)
  );
  const [filteredData, setFilteredData] = useState<Buyer[]>(
    initialBuyers.filter((b) => !b.isDeleted)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Buyer[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const router = useRouter();

  // Filter data based on search term
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const result = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.abn.toLowerCase().includes(term.toLowerCase()) ||
        item.contactName.toLowerCase().includes(term.toLowerCase()) ||
        item.email.toLowerCase().includes(term.toLowerCase()) ||
        item.phone.toLowerCase().includes(term.toLowerCase())
      );
    });
    setFilteredData(result);
  };

  const handleRowClicked = (row: Buyer) => {
    router.push(`/buyer-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Buyer[];
  }) => {
    setSelectedRows(selected.selectedRows);
  };

  const handleEdit = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select a buyer to edit");
      return;
    }
    if (selectedRows.length > 1) {
      toast.error("Please select only one buyer to edit");
      return;
    }
    router.push(`/buyer-management/edit/${selectedRows[0].id}`);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one buyer to delete");
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    // Soft delete by setting isDeleted to true
    const updatedData = data.map((buyer) =>
      selectedRows.some((row) => row.id === buyer.id)
        ? { ...buyer, isDeleted: true }
        : buyer
    );

    setData(updatedData.filter((b) => !b.isDeleted));
    setFilteredData(updatedData.filter((b) => !b.isDeleted));
    setSelectedRows([]);
    setToggleCleared(!toggleCleared);
    setIsDeleteConfirmOpen(false);
    toast.success(`${selectedRows.length} buyer(s) deleted successfully`);
  };

  const handleFilter = () => {
    // Example filter - you can expand this with more options
    const filtered = data.filter(
      (buyer) => buyer.name.toLowerCase().includes("international") // Example filter condition
    );
    setFilteredData(filtered);
    toast.success("Filter applied: Showing international buyers");
  };

  return (
    <div className="mt-20">
      <Toaster />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
        {/* Create New Buyer Button */}
        <div className="w-full md:w-auto">
          <Link href="/buyer-management/create-buyer">
            <button className="w-full md:w-auto px-4 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors shadow-sm">
              Create New Buyer
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search Buyer"
            className="w-full focus:outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
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
              List of Buyers
            </h2>
            <p className="text-sm text-gray-500">
              {filteredData.length} buyers found
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex gap-2">
            <button
              onClick={handleEdit}
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              <MdOutlineEdit />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={`w-full md:w-auto xl:px-3 xl:py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50 pointer-events-none"
              }`}
            >
              <RiDeleteBin6Fill className="text-red-500" />
              Delete
            </button>
            <button
              onClick={handleFilter}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              <IoFilterSharp />
              Filter
            </button>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-auto border border-gray-200">
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
        <div className="fixed inset-0z bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="px-5 py-3 border-b border-[#D3D3D3]">
              <h3 className="text-lg font-semibold flex gap-x-5 items-center">
                <IoWarning color="red" />
                Delete selected buyers?
              </h3>
            </div>
            <div className="mt-5 px-5 pb-5">
              <p className="mb-4 text-center">
                Are you sure you want to delete {selectedRows.length} selected
                buyer(s)? This action cannot be undone.
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

export default BuyerManagementPage;
