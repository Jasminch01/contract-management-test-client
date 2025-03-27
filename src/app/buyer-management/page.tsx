"use client";
import { Client } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "BUYER NAME",
    selector: (row: Client) => row.buyerName,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Client) => row.abn,
    sortable: true,
  },
  {
    name: "MAIN CONTRACT",
    selector: (row: Client) => row.mainContract,
    sortable: true,
  },
  {
    name: "EMAIL",
    selector: (row: Client) => row.email,
    sortable: true,
  },
  {
    name: "PHONE",
    selector: (row: Client) => row.phone,
    sortable: true,
  },
];

const data: Client[] = [
  {
    id: "1",
    buyerName: "John Doe",
    abn: "12 345 678 901",
    mainContract: "Contract A",
    email: "john@example.com",
    phone: "+61 400 000 001",
  },
  {
    id: "2",
    buyerName: "Jane Smith",
    abn: "98 765 432 109",
    mainContract: "Contract B",
    email: "jane@example.com",
    phone: "+61 400 000 002",
  },
  {
    id: "3",
    buyerName: "Alice Johnson",
    abn: "11 222 333 444",
    mainContract: "Contract C",
    email: "alice@example.com",
    phone: "+61 400 000 003",
  },
  {
    id: "4",
    buyerName: "Bob Brown",
    abn: "55 666 777 888",
    mainContract: "Contract D",
    email: "bob@example.com",
    phone: "+61 400 000 004",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Contract E",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
  },
];

const customStyles = {
  table: {
    style: {
      border: "1px solid #ddd",
    },
  },
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
      color: "#495057",
      fontSize: "0.875rem",
      padding: "12px 15px",
    },
  },
  cells: {
    style: {
      borderRight: "1px solid #ddd",
      padding: "12px 15px",
      fontSize: "0.875rem",
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
      },
    },
  },
};

const SellerManagementPage = () => {
  const router = useRouter();

  const handleRowClicked = (row: Client) => {
    router.push(`/buyer-management/${row.id}`);
  };

  const handleChange = (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: Client[];
  }) => {
    const selectedIds = selected.selectedRows.map((row) => row.id);
    console.log("Selected Row IDs: ", selectedIds);
  };

  return (
    <div className="mt-20 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-10">
        {/* Create New Buyer Button */}
        <div className="w-full md:w-auto">
          <Link href="/buyer-management/create-buyer">
            <button className="w-full md:w-auto px-4 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded-md cursor-pointer hover:bg-[#1e4728] transition-colors shadow-sm">
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
          />
          <LuSearch className="text-gray-500" />
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Title */}
        <div className="w-full md:w-auto">
          <h2 className="text-lg font-semibold text-gray-800">
            List of Buyers
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:w-auto flex gap-2">
          <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
            <MdOutlineEdit />
            Edit
          </button>
          <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
            <RiDeleteBin6Fill className="text-red-500" />
            Delete
          </button>
          <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
            <IoFilterSharp />
            Filter
          </button>
        </div>
      </div>

      {/* DataTable */}
      <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm">
        <DataTable
          columns={columns}
          data={data}
          customStyles={customStyles}
          onRowClicked={handleRowClicked}
          selectableRows
          onSelectedRowsChange={handleChange}
          fixedHeader
          fixedHeaderScrollHeight="600px"
          responsive
          pagination
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default SellerManagementPage;
