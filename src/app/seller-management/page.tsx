"use client";
import { Client } from "@/types/types";
import React from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const columns = [
  {
    name: "Seller Name",
    selector: (row: Client) => row.buyerName,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Client) => row.abn,
    sortable: true,
  },
  {
    name: "Main Contract",
    selector: (row: Client) => row.mainContract,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row: Client) => row.email,
    sortable: true,
  },
  {
    name: "Phone",
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
];

const customStyles = {
  cells: {
    style: {
      borderRight: "1px solid #ddd", // Add right border to each cell
    },
  },
  headCells: {
    style: {
      borderRight: "1px solid #ddd", // Add right border to each header cell
      fontWeight: "bold",
      color: "gray",
    },
  },
  // selectableRowsCell: {
  //   style: {
  //     borderRight: "none !important", // Remove right border
  //   },
  // },
};

const handleChange = (selected: {
  allSelected: boolean;
  selectedCount: number;
  selectedRows: Client[];
}) => {
  const selectedIds = selected.selectedRows.map((row) => row.id);
  console.log("Selected Row IDs: ", selectedIds);
};

const SellerManagementPage = () => {
  return (
    <div className="mt-20 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-10">
        {/* Create New Seller Button */}
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#1e4728] transition-colors">
            Create New Seller
            <IoIosPersonAdd className="text-lg" />
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto px-4 py-2 rounded border border-gray-400 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Seller"
            className="w-full focus:outline-none"
          />
          <LuSearch className="text-gray-400" />
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Title */}
        <div className="w-full md:w-auto">
          <p className="text-lg font-semibold">List of Sellers</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:w-auto flex flex-wrap gap-2">
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
      <div className="overflow-x-scroll">
        <DataTable
          columns={columns}
          customStyles={customStyles}
          data={data}
          selectableRows
          onSelectedRowsChange={handleChange}
          responsive
          pagination
          className="border border-gray-200 rounded"
        />
      </div>
    </div>
  );
};

export default SellerManagementPage;
