"use client";
import { Contract } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Changed from next/router
import React from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "CONTRACT NUMBER",
    selector: (row: Contract) => row.contractNumber,
    sortable: true,
  },
  {
    name: "SEASON",
    selector: (row: Contract) => row.season,
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
    selector: (row: Contract) => row.buyer,
    sortable: true,
  },
  {
    name: "DESTINATION",
    selector: (row: Contract) => row.destination,
    sortable: true,
  },
  {
    name: "CONTRACT",
    selector: (row: Contract) => row.contract,
    sortable: true,
  },
  {
    name: "STATUS",
    selector: (row: Contract) => row.status,
    sortable: true,
    cell: (row: Contract) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          row.status === "Approved"
            ? "bg-green-100 text-green-800"
            : row.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

const data: Contract[] = [
  {
    id: "1",
    contractNumber: "CN12345",
    season: "2023",
    grower: "John Doe",
    tonnes: 150,
    buyer: "ABC Foods",
    destination: "Sydney",
    contract: "Active",
    status: "Approved",
  },
  {
    id: "2",
    contractNumber: "CN67890",
    season: "2023",
    grower: "Jane Smith",
    tonnes: 200,
    buyer: "XYZ Distributors",
    destination: "Melbourne",
    contract: "Active",
    status: "Pending",
  },
  {
    id: "3",
    contractNumber: "CN11223",
    season: "2022",
    grower: "Alice Johnson",
    tonnes: 100,
    buyer: "Fresh Produce Co.",
    destination: "Brisbane",
    contract: "Inactive",
    status: "Rejected",
  },
  {
    id: "4",
    contractNumber: "CN44556",
    season: "2023",
    grower: "Bob Brown",
    tonnes: 250,
    buyer: "Global Foods",
    destination: "Perth",
    contract: "Active",
    status: "Approved",
  },
  {
    id: "5",
    contractNumber: "CN77889",
    season: "2022",
    grower: "Charlie Davis",
    tonnes: 300,
    buyer: "Organic Farms",
    destination: "Adelaide",
    contract: "Inactive",
    status: "Pending",
  },
];

const customStyles = {
  rows: {
    style: {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f5f5f5",
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

const ContractManagementPage = () => {
  const router = useRouter();

  const handleRowClicked = (row: Contract) => {
    router.push(`/contract-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Contract[];
  }) => {
    const selectedIds = selected.selectedRows.map((row) => row.id);
    console.log("Selected Row IDs: ", selectedIds);
  };

  return (
    <div className="mt-20 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-10">
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
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Title */}
        <div className="w-full md:w-auto">
          <p className="text-lg font-semibold">List of Contracts</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:w-auto flex gap-2">
          <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
            <MdOutlineEdit />
            Edit
          </button>
          <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
            <RiDeleteBin6Fill className="text-red-500" />
            Delete
          </button>
          <button className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
            <IoFilterSharp />
            Filter
          </button>
        </div>
      </div>

      {/* DataTable */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <DataTable
          columns={columns}
          data={data}
          customStyles={customStyles}
          onRowClicked={handleRowClicked}
          selectableRows
          onSelectedRowsChange={handleChange}
          responsive
          pagination
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default ContractManagementPage;
