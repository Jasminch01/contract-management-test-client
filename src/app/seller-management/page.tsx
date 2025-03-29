"use client";
import { Client } from "@/types/types";
import Link from "next/link";
import React from "react";
import DataTable from "react-data-table-component";
import { IoIosPersonAdd } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

const columns = [
  {
    name: "SELLER NAME",
    selector: (row: Client) => row.buyerName,
    sortable: true,
  },
  {
    name: "ABN",
    selector: (row: Client) => row.abn,
    sortable: true,
  },
  {
    name: "MAIN CONTACT",
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
    mainContract: "Commex International",
    email: "john@example.com",
    phone: "+61 400 000 001",
  },
  {
    id: "2",
    buyerName: "Jane Smith",
    abn: "98 765 432 109",
    mainContract: "Commex International",
    email: "jane@example.com",
    phone: "+61 400 000 002",
  },
  {
    id: "3",
    buyerName: "Alice Johnson",
    abn: "11 222 333 444",
    mainContract: "Commex International",
    email: "alice@example.com",
    phone: "+61 400 000 003",
  },
  {
    id: "4",
    buyerName: "Bob Brown",
    abn: "55 666 777 888",
    mainContract: "Commex International",
    email: "bob@example.com",
    phone: "+61 400 000 004",
  },
  {
    id: "5",
    buyerName: "Charlie Davis",
    abn: "99 888 777 666",
    mainContract: "Commex International",
    email: "charlie@example.com",
    phone: "+61 400 000 005",
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
    },
  },
  headCells: {
    style: {
      borderRight: "1px solid #ddd",
      fontWeight: "bold",
      color: "gray",
    },
  },
};

const SellerManagementPage = () => {
  const router = useRouter();

  const handleRowClicked = (row: Client) => {
    router.push(`/seller-management/${row.id}`);
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
    <div className="mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-300 pb-5 px-4">
        {/* Create New Seller Button */}
        <div className="w-full md:w-auto">
          <Link href={`/seller-management/create-seller`}>
            <button className="w-full md:w-auto px-3 py-2 bg-[#2A5D36] text-white text-sm flex items-center justify-center gap-2 rounded cursor-pointer hover:bg-[#1e4728] transition-colors">
              Create New Seller
              <IoIosPersonAdd className="text-lg" />
            </button>
          </Link>
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
      <div className="mt-3">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-4">
          {/* Title */}
          <div className="w-full md:w-auto">
            <p className="text-lg font-semibold">List of Sellers</p>
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
        <div className="overflow-x-scroll">
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
            className="border border-gray-200 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default SellerManagementPage;
