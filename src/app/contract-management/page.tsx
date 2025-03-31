"use client";
import { Contract } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast, { Toaster } from "react-hot-toast";
import { IoIosPersonAdd, IoIosSend } from "react-icons/io";
import { IoDocumentText, IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiCircleFill, RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "CONTRACT NUMBER",
    selector: (row: Contract) => row.contractNumber,
    sortable: true,
  },
  {
    name: "SEASON",
    selector: (row: Contract) => row.commoditySeason,
    sortable: true,
  },
  {
    name: "GROWER",
    selector: (row: Contract) => row.grower,
    sortable: true,
  },
  {
    name: "TONNES",
    selector: (row: Contract) => row.tonnes,
    sortable: true,
  },
  {
    name: "BUYER",
    selector: (row: Contract) => row.buyer.name,
    sortable: true,
  },
  {
    name: "DESTINATION",
    selector: (row: Contract) => row.destination,
    sortable: true,
  },
  {
    name: "CONTRACT PRICE",
    selector: (row: Contract) => row.priceExGst,
    sortable: true,
  },
  {
    name: "STATUS",
    selector: (row: Contract) => row.status,
    sortable: true,
    cell: (row: Contract) => (
      <p className={`text-xs flex items-center gap-x-3`}>
        <RiCircleFill
          className={`${
            row.status.toLowerCase() !== "completed"
              ? "text-[#FAD957]"
              : "text-[#B1B1B1]"
          }`}
        />
        {row.status}
      </p>
    ),
  },
  {
    name: "NOTES",
    selector: (row: Contract) => row.notes,
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

const statusOptions = [
  { value: "recent", label: "Recent" },
  { value: "Completed", label: "Completed" },
  { value: "Not Done", label: "Not Done" },
];

const ContractManagementPage = () => {
  const router = useRouter();
  const [data, setData] = useState<Contract[]>([]);
  const [originalData, setOriginalData] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRows, setSelectedRows] = useState<Contract[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Handle row click to view details
  const handleRowClicked = (row: Contract) => {
    router.push(`/contract-management/${row.id}`);
  };

  // Handle row selection
  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Contract[];
  }) => {
    setSelectedRows(selected.selectedRows);
  };

  // Load data
  useEffect(() => {
    fetch("/contracts.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setOriginalData(data);
      });
  }, []);

  // Filter data based on search term and status
  useEffect(() => {
    let filteredData = originalData;

    if (searchTerm) {
      filteredData = filteredData.filter((contract) =>
        Object.values(contract).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedStatus !== "all") {
      filteredData = filteredData.filter(
        (contract) => contract.status === selectedStatus
      );
    }

    setData(filteredData);
  }, [searchTerm, selectedStatus, originalData]);

  // Handle delete selected contracts
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one contract to delete");
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const newData = originalData.filter(
      (contract) => !selectedRows.some((row) => row.id === contract.id)
    );
    setOriginalData(newData);
    setSelectedRows([]);
    setIsDeleteConfirmOpen(false);
    toast.success(`${selectedRows.length} contract(s) deleted successfully`);
  };

  // Handle edit selected contract
  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      toast.error("Please select exactly one contract to edit");
      return;
    }
    router.push(`/contract-management/${selectedRows[0].id}/edit`);
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    // In a real app, this would generate a PDF
    if (selectedRows.length === 0) {
      toast.error(`Please select at least one contract to generate PDF`);
      return;
    }
    toast.success(`Exporting ${data.length} contracts to PDF`);
  };

  // Handle email actions
  const handleEmail = (recipient: "buyer" | "seller") => {
    if (selectedRows.length === 0) {
      toast.error(`Please select at least one contract to email ${recipient}`);
      return;
    }
    toast.success(`Emailing ${selectedRows.length} contracts to ${recipient}`);
  };

  return (
    <div className="mt-20">
      <Toaster />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-300 px-4">
        {/* Create New Contract Button */}
        <div className="w-full md:w-auto">
          <Link href="/contract-management/create-contract">
            <button className="w-full md:w-auto px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#1e4728] transition-colors rounded">
              Create New Contract
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded border border-gray-400 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Contract"
            className="w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>

      {/* Table Controls */}
      <div className="mt-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <p className="text-lg font-semibold">List of Contracts</p>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex flex-col lg:flex-row gap-2">
            <button
              onClick={handleExportPDF}
              className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              <IoDocumentText />
              Export as PDF
            </button>
            <button
              onClick={() => handleEmail("buyer")}
              className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors`}
            >
              <IoIosSend />
              Email to Buyer
            </button>
            <button
              onClick={() => handleEmail("seller")}
              className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              <IoIosSend />
              Email to Seller
            </button>
            <button
              onClick={handleEdit}
              className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              <MdOutlineEdit />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedRows.length > 0
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              <RiDeleteBin6Fill className="text-red-500" />
              Delete
            </button>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <IoFilterSharp />
                Filter
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-2">
                  <p className="font-medium mb-2 text-center">
                    Filter by Status
                  </p>
                  {statusOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-2 text-center hover:bg-gray-100 cursor-pointer ${
                        selectedStatus === option.value ? "bg-gray-100" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus(option.value);
                        setIsFilterOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-x-auto border border-gray-300">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            onRowClicked={handleRowClicked}
            selectableRows
            onSelectedRowsChange={handleChange}
            fixedHeader
            fixedHeaderScrollHeight="500px"
            responsive
            pagination
            pointerOnHover
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete {selectedRows.length} selected
              contract(s)?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagementPage;
